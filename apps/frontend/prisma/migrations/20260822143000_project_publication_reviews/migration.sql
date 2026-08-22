CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

ALTER TABLE "ServiceOrder"
ADD COLUMN "projectSlug" TEXT,
ADD COLUMN "publicTitle" TEXT,
ADD COLUMN "publicSummary" TEXT,
ADD COLUMN "publishedAt" TIMESTAMP(3);

ALTER TABLE "ProjectReview"
ADD COLUMN "publicText" TEXT,
ADD COLUMN "clientRole" TEXT,
ADD COLUMN "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "moderatedAt" TIMESTAMP(3),
ADD COLUMN "publishedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "ServiceOrder_projectSlug_key" ON "ServiceOrder"("projectSlug");
CREATE INDEX "ServiceOrder_publishedAt_idx" ON "ServiceOrder"("publishedAt");
CREATE INDEX "ProjectReview_status_publishedAt_idx" ON "ProjectReview"("status", "publishedAt");
