CREATE TYPE "OrderStatus" AS ENUM (
  'NEW',
  'DISCOVERY',
  'PLANNING',
  'DESIGN',
  'DEVELOPMENT',
  'QA',
  'LAUNCH',
  'SUPPORT',
  'COMPLETED',
  'CANCELLED'
);

CREATE TABLE "ServiceOrder" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
  "total" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'RUB',
  "locale" TEXT NOT NULL DEFAULT 'ru',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ServiceOrder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ServiceOrderItem" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "ServiceOrderItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ServiceOrder_userId_createdAt_idx" ON "ServiceOrder"("userId", "createdAt");
CREATE INDEX "ServiceOrder_status_createdAt_idx" ON "ServiceOrder"("status", "createdAt");
CREATE INDEX "ServiceOrderItem_orderId_idx" ON "ServiceOrderItem"("orderId");

ALTER TABLE "ServiceOrder"
  ADD CONSTRAINT "ServiceOrder_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ServiceOrderItem"
  ADD CONSTRAINT "ServiceOrderItem_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "ServiceOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
