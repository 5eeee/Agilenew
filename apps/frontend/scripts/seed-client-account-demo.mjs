import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const email = process.argv[2];

if (!email) throw new Error("Pass the test account email as the first argument");

const user = await db.user.findUnique({ where: { email }, select: { id: true } });
if (!user) throw new Error("Test account not found");

async function ensureOrder(name, data) {
  const existing = await db.serviceOrder.findFirst({ where: { userId: user.id, name } });
  if (existing) return existing;
  return db.serviceOrder.create({ data: { userId: user.id, name, locale: "ru", ...data } });
}

const active = await ensureOrder("Демонстрационный проект — клиентский портал", {
  status: "PLANNING",
  paymentStatus: "PAID",
  total: 185000,
  items: { create: [
    { serviceId: "business-audit", title: "Бизнес-аудит", price: 65000 },
    { serviceId: "crm-mvp", title: "Клиентский портал", price: 120000 },
  ] },
});

for (const [stage, clientApproved] of [["NEW", true], ["DISCOVERY", true], ["PLANNING", false]]) {
  await db.orderStageApproval.upsert({
    where: { orderId_stage: { orderId: active.id, stage } },
    create: { orderId: active.id, stage, executorApprovedAt: new Date(), clientApprovedAt: clientApproved ? new Date() : null },
    update: { executorApprovedAt: new Date(), clientApprovedAt: clientApproved ? new Date() : null },
  });
}

const completed = await ensureOrder("Демонстрационный проект — аудит процессов", {
  status: "COMPLETED",
  paymentStatus: "PAID",
  total: 70000,
  items: { create: [{ serviceId: "it-audit", title: "IT-аудит компании", price: 70000 }] },
});

for (const stage of ["NEW", "DISCOVERY", "PLANNING", "DESIGN", "DEVELOPMENT", "QA", "LAUNCH", "SUPPORT", "COMPLETED"]) {
  await db.orderStageApproval.upsert({
    where: { orderId_stage: { orderId: completed.id, stage } },
    create: { orderId: completed.id, stage, executorApprovedAt: new Date(), clientApprovedAt: new Date() },
    update: { executorApprovedAt: new Date(), clientApprovedAt: new Date() },
  });
}

console.log("Client account demo data is ready");
await db.$disconnect();
