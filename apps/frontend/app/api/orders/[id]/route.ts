import { z } from "zod";
import { db } from "@/lib/db";
import { sendOrderStatusEmail } from "@/lib/mail";
import { notifyOrderPlatform } from "@/lib/order-events";
import type { Locale } from "@/lib/i18n";
import { projectSlugs } from "@/lib/projects";

const projectSlugSet = new Set<string>(projectSlugs);
const orderFlow = ["NEW", "DISCOVERY", "PLANNING", "DESIGN", "DEVELOPMENT", "QA", "LAUNCH", "SUPPORT", "COMPLETED"] as const;

const input = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  status: z.enum(["NEW", "DISCOVERY", "PLANNING", "DESIGN", "DEVELOPMENT", "QA", "LAUNCH", "SUPPORT", "COMPLETED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "REFUNDED"]).optional(),
  projectSlug: z.string().trim().max(100).nullable().optional().refine((value) => !value || projectSlugSet.has(value), "Unknown public project"),
  publicTitle: z.string().trim().max(160).nullable().optional(),
  publicSummary: z.string().trim().max(3000).nullable().optional(),
  published: z.boolean().optional(),
  reviewStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  reviewPublicText: z.string().trim().max(3000).nullable().optional(),
  reviewClientRole: z.string().trim().max(120).nullable().optional(),
}).refine((value) => Object.values(value).some((item) => item !== undefined), "No changes supplied");

function admin(request: Request) {
  const token = process.env.AGILE_LEADS_READ_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

function localeOf(value: string): Locale {
  return value === "ru" || value === "en" || value === "pl" || value === "ka" || value === "hy" || value === "bg" ? value : "en";
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!admin(request)) return Response.json({ detail: "Forbidden" }, { status: 403 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ detail: "Invalid update" }, { status: 400 });
  const { id } = await params;

  try {
    const previous = await db.serviceOrder.findUnique({ where: { id }, include: { review: true, stageApprovals: true } });
    if (!previous) return Response.json({ detail: "Order not found" }, { status: 404 });
    const nextStatus = parsed.data.status ?? previous.status;
    const nextPaymentStatus = parsed.data.paymentStatus ?? previous.paymentStatus;
    const nextProjectSlug = parsed.data.projectSlug === undefined ? previous.projectSlug : parsed.data.projectSlug || null;
    if (nextStatus !== "NEW" && nextStatus !== "CANCELLED" && nextPaymentStatus !== "PAID") return Response.json({ detail: "Подтвердите оплату до начала этапов проекта" }, { status: 409 });
    const previousIndex = orderFlow.indexOf(previous.status as (typeof orderFlow)[number]);
    const nextIndex = orderFlow.indexOf(nextStatus as (typeof orderFlow)[number]);
    if (nextIndex > previousIndex && previousIndex >= 0) {
      const currentApproval = previous.stageApprovals.find((approval) => approval.stage === previous.status);
      if (!currentApproval?.executorApprovedAt || !currentApproval.clientApprovedAt) return Response.json({ detail: "Текущий этап должны подтвердить и команда, и клиент" }, { status: 409 });
    }
    if (parsed.data.published && nextStatus !== "COMPLETED") return Response.json({ detail: "Завершите проект перед публикацией" }, { status: 409 });
    if (parsed.data.published && !nextProjectSlug) return Response.json({ detail: "Выберите проект из раздела «Наши работы»" }, { status: 409 });
    if ((parsed.data.reviewStatus || parsed.data.reviewPublicText !== undefined || parsed.data.reviewClientRole !== undefined) && !previous.review) return Response.json({ detail: "Клиент ещё не оставил отзыв" }, { status: 409 });
    const { published, reviewStatus, reviewPublicText, reviewClientRole, ...orderChanges } = parsed.data;
    const order = await db.$transaction(async (tx) => {
      const updated = await tx.serviceOrder.update({
        where: { id },
        data: {
          ...orderChanges,
          ...(published !== undefined ? { publishedAt: published ? new Date() : null } : {}),
        },
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
      if (previous.review && (reviewStatus || reviewPublicText !== undefined || reviewClientRole !== undefined)) {
        await tx.projectReview.update({
          where: { id: previous.review.id },
          data: {
            ...(reviewStatus ? { status: reviewStatus, moderatedAt: new Date(), publishedAt: reviewStatus === "APPROVED" ? new Date() : null } : {}),
            ...(reviewPublicText !== undefined ? { publicText: reviewPublicText || null } : {}),
            ...(reviewClientRole !== undefined ? { clientRole: reviewClientRole || null } : {}),
          },
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
    return Response.json({ detail: "Не удалось сохранить проект. Проверьте, что выбранный публичный проект не связан с другим заказом." }, { status: 409 });
  }
}
