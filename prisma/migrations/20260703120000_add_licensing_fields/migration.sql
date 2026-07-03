-- CalmKept Pro licensing fields (additive, no data loss)
ALTER TABLE "Lead" ADD COLUMN "tier" TEXT;
ALTER TABLE "Lead" ADD COLUMN "firmName" TEXT;
ALTER TABLE "Lead" ADD COLUMN "profession" TEXT;
ALTER TABLE "Lead" ADD COLUMN "licenseExpiresAt" TIMESTAMP(3);
