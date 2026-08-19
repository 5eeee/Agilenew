import { z } from "zod";
import { db } from "@/lib/db";

const input = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  status: z.enum(["NEW", "DISCOVERY", "PLANNING", "DESIGN", "DEVELOPMENT", "QA", "LAUNCH", "SUPPORT", "COMPLETED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "REFUNDED"]).optional(),
}).refine((value) => value.name || value.status || value.paymentStatus, "No changes supplied");

function admin(request: Request) {
  const token = process.env.AGILE_LEADS_READ_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!admin(request)) return Response.json({ detail: "Forbidden" }, { status: 403 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ detail: "Invalid update" }, { status: 400 });
  const { id } = await params;

  try {
    const order = await db.serviceOrder.update({ where: { id }, data: parsed.data, include: { items: true, user: { select: { name: true, email: true } } } });
    return Response.json(order);
  } catch {
    return Response.json({ detail: "Order not found" }, { status: 404 });
  }
}
