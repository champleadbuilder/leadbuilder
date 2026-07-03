import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // CLI (migrate/studio) prefers the direct endpoint — pooled endpoints
    // (PgBouncer) break migrations. App runtime is unaffected: it builds its
    // own pg Pool from DATABASE_URL (see lib/prisma).
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
})