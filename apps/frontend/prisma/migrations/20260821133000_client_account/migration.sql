ALTER TABLE "User"
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "avatarData" TEXT;

CREATE TABLE "OrderStageApproval" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "stage" "OrderStatus" NOT NULL,
  "executorApprovedAt" TIMESTAMP(3),
  "clientApprovedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OrderStageApproval_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectReview" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProjectReview_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OrderStageApproval_orderId_stage_key" ON "OrderStageApproval"("orderId", "stage");
CREATE INDEX "OrderStageApproval_orderId_createdAt_idx" ON "OrderStageApproval"("orderId", "createdAt");
CREATE UNIQUE INDEX "ProjectReview_orderId_key" ON "ProjectReview"("orderId");
CREATE INDEX "ProjectReview_userId_createdAt_idx" ON "ProjectReview"("userId", "createdAt");

ALTER TABLE "OrderStageApproval"
  ADD CONSTRAINT "OrderStageApproval_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "ServiceOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectReview"
  ADD CONSTRAINT "ProjectReview_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "ServiceOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectReview"
  ADD CONSTRAINT "ProjectReview_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
