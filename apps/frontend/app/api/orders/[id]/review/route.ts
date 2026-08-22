import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { rateLimit, rejectCrossSiteMutation } from "@/lib/request-security";

const input = z.object({ rating: z.number().int().min(1).max(5), text: z.string().trim().min(80).max(3000), clientRole: z.string().trim().max(120).optional() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const blocked = rejectCrossSiteMutation(request);
  if (blocked) return blocked;
  const user = await currentUser();
  if (!user) return Response.json({ detail: "Authentication required" }, { status: 401 });
  const limited = rateLimit(request, `review:${user.id}`, 12, 30 * 60 * 1000);
  if (limited) return limited;
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ detail: "Invalid review" }, { status: 400 });
  const { id } = await params;
  const order = await db.serviceOrder.findFirst({ where: { id, userId: user.id }, select: { id: true, status: true } });
  if (!order) return Response.json({ detail: "Order not found" }, { status: 404 });
  if (order.status !== "COMPLETED") return Response.json({ detail: "A review is available after project completion" }, { status: 409 });
  const review = await db.projectReview.upsert({
    where: { orderId: order.id },
    create: { orderId: order.id, userId: user.id, rating: parsed.data.rating, text: parsed.data.text, clientRole: parsed.data.clientRole || null },
    update: { rating: parsed.data.rating, text: parsed.data.text, clientRole: parsed.data.clientRole || null, status: "PENDING", moderatedAt: null, publishedAt: null },
  });
  return Response.json({ rating: review.rating, text: review.text, client_role: review.clientRole, status: review.status, created_at: review.createdAt.toISOString() });
}
