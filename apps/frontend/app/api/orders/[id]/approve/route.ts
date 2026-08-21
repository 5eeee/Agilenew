import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { rateLimit, rejectCrossSiteMutation } from "@/lib/request-security";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const blocked = rejectCrossSiteMutation(request);
  if (blocked) return blocked;
  const user = await currentUser();
  if (!user) return Response.json({ detail: "Authentication required" }, { status: 401 });
  const limited = rateLimit(request, `approve:${user.id}`, 30, 10 * 60 * 1000);
  if (limited) return limited;
  const { id } = await params;
  const order = await db.serviceOrder.findFirst({ where: { id, userId: user.id }, select: { id: true, status: true, paymentStatus: true } });
  if (!order) return Response.json({ detail: "Order not found" }, { status: 404 });
  if (order.paymentStatus !== "PAID") return Response.json({ detail: "Payment is not confirmed" }, { status: 409 });
  if (order.status === "CANCELLED") return Response.json({ detail: "Cancelled order cannot be approved" }, { status: 409 });
  const approval = await db.orderStageApproval.findUnique({ where: { orderId_stage: { orderId: order.id, stage: order.status } } });
  if (!approval?.executorApprovedAt) return Response.json({ detail: "The team has not submitted this stage yet" }, { status: 409 });
  const updated = await db.orderStageApproval.update({ where: { id: approval.id }, data: { clientApprovedAt: approval.clientApprovedAt ?? new Date() } });
  return Response.json({ stage: updated.stage, client_approved_at: updated.clientApprovedAt?.toISOString() });
}
