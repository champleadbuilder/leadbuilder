#!/usr/bin/env node
// Calmkept Pro — prospect CSV importer
//
// Loads outreach prospects into the existing Lead pipeline. Dedupes by email
// (case-insensitive) so re-running the same CSV is safe.
//
// Usage:  node scripts/import-prospects.mjs prospects.csv [--dry-run]
//
// CSV columns (header row required, order-free):
//   name        required — the professional's name, or firm name if unknown
//   email       required — public business email only
//   firmName    optional
//   profession  optional — advisor | attorney | funeral | hospice | other
//   location    optional — "Norwalk, CT"
//   source      optional — defaults by profession: outreach-a (advisor),
//               outreach-b (attorney), outreach-c (funeral/hospice)
//   notes       optional — personalization hook for the [P] line; goes to `message`
//
// Sourcing rules (per pro-prospect-sourcing.md): public business contact info
// only, no scraped personal emails, no purchased lists in v1.

import 'dotenv/config'
import fs from 'node:fs'
import pg from 'pg'

const { Pool } = pg

const file = process.argv[2]
const dryRun = process.argv.includes('--dry-run')
if (!file) {
  console.error('Usage: node scripts/import-prospects.mjs <file.csv> [--dry-run]')
  process.exit(1)
}

// Minimal CSV parser: handles quoted fields with commas and doubled quotes.
function parseCsv(text) {
  const rows = []
  let row = [], field = '', inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') inQuotes = false
      else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') {
      if (field !== '' || row.length) { row.push(field); rows.push(row); row = []; field = '' }
      if (c === '\r' && text[i + 1] === '\n') i++
    } else field += c
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows
}

const defaultSource = (profession) =>
  ({ advisor: 'outreach-a', attorney: 'outreach-b', funeral: 'outreach-c', hospice: 'outreach-c' }[
    (profession || '').toLowerCase()
  ] ?? 'outreach-other')

const [header, ...lines] = parseCsv(fs.readFileSync(file, 'utf8'))
const col = Object.fromEntries(header.map((h, i) => [h.trim().toLowerCase(), i]))
for (const required of ['name', 'email']) {
  if (!(required in col)) {
    console.error(`CSV missing required column: ${required}`)
    process.exit(1)
  }
}

const records = lines
  .filter((l) => l.length > 1 || (l[0] ?? '').trim())
  .map((l) => ({
    name: l[col.name]?.trim(),
    email: l[col.email]?.trim().toLowerCase(),
    firmName: l[col.firmname]?.trim() || null,
    profession: l[col.profession]?.trim().toLowerCase() || null,
    location: l[col.location]?.trim() || null,
    source: l[col.source]?.trim() || null,
    notes: l[col.notes]?.trim() || null,
  }))
  .filter((r) => r.name && r.email && r.email.includes('@'))

console.log(`${records.length} valid rows in ${file}`)
if (dryRun) {
  console.table(records.slice(0, 10))
  process.exit(0)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
let inserted = 0, skipped = 0

for (const r of records) {
  const existing = await pool.query(
    'SELECT id FROM "Lead" WHERE LOWER("email") = $1 LIMIT 1',
    [r.email]
  )
  if (existing.rows.length) { skipped++; continue }

  await pool.query(
    `INSERT INTO "Lead"
       ("id", "name", "email", "firmName", "profession", "location", "source",
        "message", "status", "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'prospect', NOW(), NOW())`,
    [r.name, r.email, r.firmName, r.profession, r.location,
     r.source ?? defaultSource(r.profession), r.notes]
  )
  inserted++
}

await pool.end()
console.log(`inserted ${inserted}, skipped ${skipped} (already present)`)
