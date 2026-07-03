#!/usr/bin/env node
// Calmkept Pro — co-brand stamping engine
//
// Inserts a licensee co-brand page into the master binder PDF and writes a
// branded copy ready for delivery. Runs anywhere Node 18+ and pdf-lib exist.
//
// Usage:
//   node scripts/stamp-binder.mjs \
//     --master path/to/Calmkept-Family-Emergency-Binder-LETTER.pdf \
//     --licensee path/to/licensee.json \
//     [--logo path/to/logo.png] \
//     [--out path/to/output.pdf]
//
// licensee.json:
//   {
//     "firmName": "Harbor Point Wealth Management",
//     "professionalName": "Jane Doe, CFP",
//     "phone": "(203) 555-0142",
//     "email": "jane@harborpointwm.com",
//     "website": "harborpointwm.com",
//     "tier": "pro"            // pro | white-label
//   }
//
// Install once:  npm install pdf-lib
//
// Brand rules honored: sentence case, calm palette (cream/charcoal/sage),
// no exclamation marks, "quiet act of love" framing.

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";

// ---- palette (from Calmkept design system) ----
const CREAM = rgb(0xf5 / 255, 0xf0 / 255, 0xe8 / 255);
const CHARCOAL = rgb(0x3a / 255, 0x3a / 255, 0x3a / 255);
const SAGE = rgb(0x88 / 255, 0xa0 / 255, 0x96 / 255);

function arg(flag, fallback = null) {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const masterPath = arg("--master");
const licenseePath = arg("--licensee");
const logoPath = arg("--logo");
const outPath = arg("--out");

if (!masterPath || !licenseePath) {
  console.error("Required: --master <master.pdf> --licensee <licensee.json>");
  process.exit(1);
}

const licensee = JSON.parse(fs.readFileSync(licenseePath, "utf8"));
for (const key of ["firmName"]) {
  if (!licensee[key]) {
    console.error(`licensee.json is missing required field: ${key}`);
    process.exit(1);
  }
}

const masterBytes = fs.readFileSync(masterPath);
const pdf = await PDFDocument.load(masterBytes);

const helv = await pdf.embedFont(StandardFonts.Helvetica);
const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);
const timesItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);

// Match the master's page size (letter or A4) from its first page.
const [refPage] = pdf.getPages();
const { width: W, height: H } = refPage.getSize();

// Insert the co-brand page directly after the cover (index 1).
const page = pdf.insertPage(1, [W, H]);

// Full-bleed cream background.
page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CREAM });

const centerX = W / 2;
let cursorY = H * 0.72;

const drawCentered = (text, font, size, color, y) => {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: centerX - w / 2, y, size, font, color });
};

// Optional logo, centered above the text block.
if (logoPath && fs.existsSync(logoPath)) {
  const logoBytes = fs.readFileSync(logoPath);
  const ext = path.extname(logoPath).toLowerCase();
  const logo =
    ext === ".png" ? await pdf.embedPng(logoBytes) : await pdf.embedJpg(logoBytes);
  const maxW = W * 0.32;
  const maxH = 90;
  const scale = Math.min(maxW / logo.width, maxH / logo.height, 1);
  const lw = logo.width * scale;
  const lh = logo.height * scale;
  page.drawImage(logo, { x: centerX - lw / 2, y: cursorY, width: lw, height: lh });
  cursorY -= 36;
} else {
  cursorY += 40;
}

drawCentered("Prepared for the clients of", timesItalic, 15, CHARCOAL, cursorY);
cursorY -= 34;

drawCentered(licensee.firmName, helvBold, 22, CHARCOAL, cursorY);
cursorY -= 26;

if (licensee.professionalName) {
  drawCentered(licensee.professionalName, helv, 14, CHARCOAL, cursorY);
  cursorY -= 22;
}

// Thin sage rule.
cursorY -= 6;
page.drawLine({
  start: { x: centerX - 72, y: cursorY },
  end: { x: centerX + 72, y: cursorY },
  thickness: 0.75,
  color: SAGE,
});
cursorY -= 28;

const contactLines = [licensee.phone, licensee.email, licensee.website].filter(Boolean);
for (const line of contactLines) {
  drawCentered(line, helv, 12, CHARCOAL, cursorY);
  cursorY -= 19;
}

// Quiet anchor line near the foot of the page.
drawCentered(
  "A quiet act of love — for the people who'd otherwise have to guess.",
  timesItalic,
  11,
  SAGE,
  H * 0.12
);

// Attribution: present on pro tier, absent on white-label.
if ((licensee.tier || "pro") !== "white-label") {
  drawCentered("In partnership with Calmkept", helv, 9, SAGE, H * 0.08);
}

const out =
  outPath ||
  path.join(
    path.dirname(masterPath),
    `${path.basename(masterPath, ".pdf")}-${licensee.firmName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}.pdf`
  );

fs.writeFileSync(out, await pdf.save());
console.log(`Stamped ${pdf.getPageCount()} pages -> ${out}`);
