#!/usr/bin/env node
// Calmkept Pro — Etsy insert page generator
//
// Produces the one-page "professional licensing" insert that goes into every
// consumer download ZIP. Brand palette + voice rules applied. Letter and A4.
//
// Usage:  node scripts/make-pro-insert.mjs [outputDir]
// Output: Calmkept-Professional-Licensing-LETTER.pdf / -A4.pdf

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'node:fs'
import path from 'node:path'

const CREAM = rgb(0xf5 / 255, 0xf0 / 255, 0xe8 / 255)
const CHARCOAL = rgb(0x3a / 255, 0x3a / 255, 0x3a / 255)
const SAGE = rgb(0x88 / 255, 0xa0 / 255, 0x96 / 255)

const SIZES = { LETTER: [612, 792], A4: [595.28, 841.89] }
const outDir = process.argv[2] || '.'

for (const [label, [W, H]] of Object.entries(SIZES)) {
  const pdf = await PDFDocument.create()
  const helv = await pdf.embedFont(StandardFonts.Helvetica)
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const timesItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic)

  const page = pdf.addPage([W, H])
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CREAM })

  const cx = W / 2
  const centered = (text, font, size, color, y) => {
    const w = font.widthOfTextAtSize(text, size)
    page.drawText(text, { x: cx - w / 2, y, size, font, color })
  }
  const rule = (y, half = 72) =>
    page.drawLine({
      start: { x: cx - half, y }, end: { x: cx + half, y },
      thickness: 0.75, color: SAGE,
    })

  let y = H - 150

  centered('CALMKEPT', helv, 13, SAGE, y); y -= 54

  centered('Are you an advisor, attorney,', helvBold, 24, CHARCOAL, y); y -= 32
  centered('or funeral professional?', helvBold, 24, CHARCOAL, y); y -= 36
  rule(y); y -= 44

  const body = [
    'This binder is available for professional licensing — your name and',
    'contact details on every copy, with the right to give it to all of',
    'your clients.',
    '',
    'Professionals use it as a client gift, a signing-day deliverable,',
    'and a workshop handout. Licenses start at $199 a year.',
  ]
  for (const line of body) {
    if (line) centered(line, helv, 13.5, CHARCOAL, y)
    y -= 22
  }
  y -= 26

  centered('calmkept.com/pro', helvBold, 18, CHARCOAL, y); y -= 24
  centered('or write to care@calmkept.com', helv, 11.5, CHARCOAL, y)

  centered(
    "A quiet act of love — for the people who'd otherwise have to guess.",
    timesItalic, 11, SAGE, H * 0.11
  )

  const out = path.join(outDir, `Calmkept-Professional-Licensing-${label}.pdf`)
  fs.writeFileSync(out, await pdf.save())
  console.log(`wrote ${out}`)
}
