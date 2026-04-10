import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

const fakeLeads = [
  {
    name: 'John Smith',
    phone: '555-0101',
    location: 'New York, NY',
    message: 'Looking for a kitchen remodel',
    source: 'google',
    status: 'new',
  },
  {
    name: 'Sarah Johnson',
    phone: '555-0102',
    location: 'Los Angeles, CA',
    message: 'Bathroom renovation needed',
    source: 'facebook',
    status: 'contacted',
  },
  {
    name: 'Mike Davis',
    phone: '555-0103',
    location: 'Chicago, IL',
    message: 'Whole house painting',
    source: 'website',
    status: 'quoted',
  },
  {
    name: 'Emily Wilson',
    phone: '555-0104',
    location: 'Houston, TX',
    message: 'Deck construction',
    source: 'referral',
    status: 'booked',
  },
  {
    name: 'David Brown',
    phone: '555-0105',
    location: 'Phoenix, AZ',
    message: 'Garage conversion',
    source: 'yelp',
    status: 'lost',
  },
]

export async function POST() {
  try {
    // Clear existing leads
    await prisma.lead.deleteMany()

    // Create fake leads
    const leads = await Promise.all(
      fakeLeads.map(lead =>
        prisma.lead.create({
          data: {
            ...lead,
            nextFollowUpAt: lead.status === 'new' ? new Date(Date.now() + 2 * 60 * 60 * 1000) : null,
          },
        })
      )
    )

    return NextResponse.json({ message: `Created ${leads.length} fake leads` })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}