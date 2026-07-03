import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { prisma } from '../../../../lib/prisma'

// Calmkept Pro — Stripe webhook (no SDK; signature verified with node:crypto)
//
// Setup (Luis-side, one time):
//   1. Stripe Dashboard → Developers → Webhooks → Add endpoint
//      URL: https://<deployment>/api/stripe/webhook
//      Events: checkout.session.completed, invoice.paid, invoice.payment_failed
//   2. Copy the signing secret (whsec_...) into Vercel env as STRIPE_WEBHOOK_SECRET
//   3. When creating each Payment Link, set metadata key "tier" to
//      "pro" | "white-label" | "firm" so this handler can tag the licensee.
//
// Behavior: upserts the licensee into the existing Lead pipeline by email.
//   checkout.session.completed → status=licensee, tier, licenseExpiresAt = +1y
//   invoice.paid (renewal)     → licenseExpiresAt extended +1y
//   invoice.payment_failed     → status=renewal-risk (subscription.deleted events
//     carry no email without an API call — Stripe dashboard stays the source of
//     truth for final cancellations; licenseExpiresAt lapsing covers the rest)

const TOLERANCE_SECONDS = 300

function verifyStripeSignature(payload: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(
    header.split(',').map((p) => p.split('=') as [string, string])
  )
  const timestamp = parts['t']
  const signature = parts['v1']
  if (!timestamp || !signature) return false

  const age = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex')

  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(signature, 'hex')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

function plusOneYear(from?: Date): Date {
  const base = from && from > new Date() ? from : new Date()
  const d = new Date(base)
  d.setFullYear(d.getFullYear() + 1)
  return d
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    // Dormant until configured — never 500 on Stripe retries for a config gap.
    return NextResponse.json({ error: 'webhook not configured' }, { status: 503 })
  }

  const payload = await request.text()
  const signatureHeader = request.headers.get('stripe-signature')
  if (!signatureHeader || !verifyStripeSignature(payload, signatureHeader, secret)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(payload)
  const type: string = event.type
  const obj = event.data?.object ?? {}

  const email: string | null =
    obj.customer_details?.email ?? obj.customer_email ?? null
  const name: string =
    obj.customer_details?.name ?? obj.customer_name ?? 'Stripe licensee'
  const tier: string | null = obj.metadata?.tier ?? null

  async function findByEmail(e: string) {
    return prisma.lead.findFirst({ where: { email: e }, orderBy: { createdAt: 'desc' } })
  }

  try {
    if (type === 'checkout.session.completed' && email) {
      const existing = await findByEmail(email)
      const data = {
        status: 'licensee',
        tier: tier ?? existing?.tier ?? 'pro',
        licenseExpiresAt: plusOneYear(),
        source: existing?.source ?? 'stripe',
        nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // fulfillment SLA: 1 business day
      }
      if (existing) {
        await prisma.lead.update({ where: { id: existing.id }, data })
      } else {
        await prisma.lead.create({ data: { name, email, ...data } })
      }
    }

    if (type === 'invoice.paid' && email && obj.billing_reason !== 'subscription_create') {
      const existing = await findByEmail(email)
      if (existing) {
        await prisma.lead.update({
          where: { id: existing.id },
          data: {
            status: 'licensee',
            licenseExpiresAt: plusOneYear(existing.licenseExpiresAt ?? undefined),
          },
        })
      }
    }

    if (type === 'invoice.payment_failed' && email) {
      const existing = await findByEmail(email)
      if (existing) {
        await prisma.lead.update({
          where: { id: existing.id },
          data: {
            status: 'renewal-risk',
            nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        })
      }
    }
  } catch (err) {
    // Log and 200 anyway: Stripe retries on non-2xx, and a transient DB error
    // shouldn't build a retry storm. The event is recoverable from the Stripe
    // dashboard's event log.
    console.error('stripe webhook handler error:', err)
  }

  return NextResponse.json({ received: true })
}
