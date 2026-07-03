# Calmkept Pro — prospect sourcing playbook v1.0

**Prepared:** 2026-07-03 · **Target:** 500 prospects seeded into leadflow, worked at 20/day.
**Rules:** public business contact information only. No scraped personal emails, no purchased lists in v1, one sequence maximum (3 touches), then 90 days quiet. These rules are the deliverability moat — care@calmkept.com's domain reputation is an asset the consumer funnel also depends on.

## Priority order

Start local. The sales background and the 3-hour radius (NYC metro, lower Hudson Valley, Long Island, southern New England) are the edge — a "fellow Connecticut" line in the [P] slot outperforms any national blast, and early licensees within driving distance can become case studies and referral hubs.

### Track A — financial advisors (target 250)

| Source | How to pull | Est. yield |
|---|---|---|
| NAPFA find-an-advisor | Search by CT/NY/MA zips, filter solo + small firms. Fee-only advisors are ideal ICP: independent, relationship-driven, no broker-dealer marketing department. | 80–120 |
| XYPN directory | Younger fee-only advisors, comfortable buying digital. Listings include firm sites with contact pages. | 50–80 |
| FPA chapter directories (CT, NY, NJ) | Chapter member listings link to firm sites. Chapter events are also a warm channel later. | 40–60 |
| CFP Board "Let's Make a Plan" locator | Backfill by zip. Cross-check the firm site for the business email. | as needed |

Personalization hook to record in `notes`: their stated niche (retirees, business owners, young families), any blog/podcast content on estate or legacy planning, firm size.

### Track B — estate attorneys (target 150)

| Source | How to pull | Est. yield |
|---|---|---|
| CT Bar Association — Estates & Probate section | Member listings → firm sites → business email. | 40–60 |
| NAEPC local councils (Fairfield County, NYC, Westchester) | Estate planning council rosters mix attorneys + advisors + CPAs — dual-track value. | 40–60 |
| Avvo/Justia estate-planning listings, CT + lower NY | Public firm profiles with emails. Solo and 2–5 attorney firms only; big firms have marketing departments and procurement. | 50+ |

Hook for `notes`: solo vs small firm, whether they run workshops/seminars (workshop attorneys are the best fit — they need handouts).

### Track C — funeral homes and preneed (target 100)

| Source | How to pull | Est. yield |
|---|---|---|
| CT Funeral Directors Association member directory | Family-owned homes, public contact info. | 30–40 |
| NFDA find-a-funeral-home | CT/NY metro sweep. | 40–60 |
| Google Maps "funeral home" by town, 3-hour radius | Backfill; verify email on the home's own site. | as needed |

Hook for `notes`: family-owned (multi-generation homes respond to legacy framing), whether they advertise preplanning services.

## Workflow

1. Pull a batch of 25–50 from one source into the CSV format (`name,email,firmName,profession,location,notes`).
2. `node scripts/import-prospects.mjs batch.csv --dry-run` → eyeball → run without the flag. Dedupe is automatic; re-imports are safe.
3. Work the queue from the leadflow dashboard: 20/day, 4 days/week, sequences from `pro-outreach-sequences.md`, mandatory [P] line from `notes`.
4. Status ladder: `prospect` → `contacted` → `replied` → `sample-sent` → `licensee` (webhook sets this automatically once Stripe is live) / `passed`.
5. Weekly: reply rate by track. Whichever track clears ~5% reply gets the next 100 prospects; whichever sits under 2% after 150 sends gets its copy rewritten before more volume.

## What NOT to do

- No LinkedIn automation, no email-finder tools pointed at individuals, no CAN-SPAM games. Every message: real sender, true claims, working unsubscribe-by-reply.
- No batch over 25/day from this domain until reply handling is proven — deliverability degrades quietly and recovers slowly.
- Don't outreach NAEPC/FPA members with a generic blast; those communities talk. One bad thread in a study group costs the whole chapter.
