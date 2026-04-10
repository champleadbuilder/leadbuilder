import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return NextResponse.json(leads)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, phone, location, message, source } = body

  if (!name || !phone) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
  }

  const lead = await prisma.lead.create({
    data: {
      name,
      phone,
      location: location || null,
      message: message || null,
      source: source || null,
      nextFollowUpAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    },
  })

  return NextResponse.json(lead, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, status } = body

  if (!id || !status) {
    return NextResponse.json({ error: 'ID and status are required' }, { status: 400 })
  }

  const updateData: any = { status }
  if (['booked', 'won', 'lost'].includes(status)) {
    updateData.nextFollowUpAt = null
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(lead)
}
