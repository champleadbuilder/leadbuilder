import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function testConnection() {
  try {
    // Test the connection by trying to count leads
    const count = await prisma.lead.count()
    console.log(`✅ Connected to Supabase! Found ${count} leads in database.`)
  } catch (error) {
    console.error('❌ Connection failed:')
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()