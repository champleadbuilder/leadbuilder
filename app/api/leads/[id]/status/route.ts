import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { status } = await request.json()

  if (!status || !['new', 'contacted', 'quoted', 'booked', 'won', 'lost'].includes(status)) {
    return NextResponse.json({ error: 'Valid status is required' }, { status: 400 })
  }

  const updateData: any = { status }
  if (['booked', 'won', 'lost'].includes(status)) {
    updateData.nextFollowUpAt = null
  }

  try {
    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: updateData,
    })
    return NextResponse.json(lead)
  } catch (error) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }
}