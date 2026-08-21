import { z } from "zod";
import { db } from "@/lib/db";
import { sendOrderStatusEmail } from "@/lib/mail";
import { notifyOrderPlatform } from "@/lib/order-events";
import type { Locale } from "@/lib/i18n";

const input = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  status: z.enum(["NEW", "DISCOVERY", "PLANNING", "DESIGN", "DEVELOPMENT", "QA", "LAUNCH", "SUPPORT", "COMPLETED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "REFUNDED"]).optional(),
}).refine((value) => value.name || value.status || value.paymentStatus, "No changes supplied");

function admin(request: Request) {
  const token = process.env.AGILE_LEADS_READ_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

function localeOf(value: string): Locale {
  return value === "ru" || value === "en" || value === "ka" || value === "hy" || value === "bg" ? value : "en";
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!admin(request)) return Response.json({ detail: "Forbidden" }, { status: 403 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ detail: "Invalid update" }, { status: 400 });
  const { id } = await params;

  try {
    const previous = await db.serviceOrder.findUnique({ where: { id }, select: { status: true } });
    if (!previous) return Response.json({ detail: "Order not found" }, { status: 404 });
    const order = await db.$transaction(async (tx) => {
      const updated = await tx.serviceOrder.update({
        where: { id },
        data: parsed.data,
        include: { items: true, stageApprovals: true, review: true, user: { select: { id: true, name: true, email: true } } },
      });
      const shouldSubmitStage = (parsed.data.status && parsed.data.status !== "CANCELLED") || parsed.data.paymentStatus === "PAID";
      if (shouldSubmitStage && updated.status !== "CANCELLED") {
        await tx.orderStageApproval.upsert({
          where: { orderId_stage: { orderId: updated.id, stage: updated.status } },
          create: { orderId: updated.id, stage: updated.status, executorApprovedAt: new Date() },
          update: { executorApprovedAt: new Date() },
        });
      }
      return tx.serviceOrder.findUniqueOrThrow({
        where: { id: updated.id },
        include: { items: true, stageApprovals: true, review: true, user: { select: { id: true, name: true, email: true } } },
      });
    });

    if (parsed.data.status && parsed.data.status !== previous.status) {
      const deliveries = await Promise.allSettled([
        sendOrderStatusEmail({
          id: order.id,
          customerName: order.user.name,
          customerEmail: order.user.email,
          locale: localeOf(order.locale),
          status: order.status,
        }),
        notifyOrderPlatform({
          type: "order.status_changed",
          order: {
            id: order.id,
            name: order.name,
            status: order.status,
            payment_status: order.paymentStatus,
            total: order.total,
            currency: order.currency,
            items: order.items,
          },
          customer: order.user,
        }),
      ]);
      deliveries.forEach((result) => {
        if (result.status === "rejected") console.error("Order updated, but notification failed", result.reason instanceof Error ? result.reason.message : "unknown error");
      });
    }
    return Response.json(order);
  } catch (error) {
    console.error("Order update failed", error instanceof Error ? error.message : "unknown error");
    return Response.json({ detail: "Order not found" }, { status: 404 });
  }
}
