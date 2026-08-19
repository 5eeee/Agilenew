CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED');

ALTER TABLE "ServiceOrder"
  ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

CREATE INDEX "ServiceOrder_paymentStatus_createdAt_idx"
  ON "ServiceOrder"("paymentStatus", "createdAt");
