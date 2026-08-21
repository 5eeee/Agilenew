import { NextRequest } from "next/server";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { clearSession, createSession, currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, rejectCrossSiteMutation } from "@/lib/request-security";

const allowed = new Set(["register", "login", "logout", "me", "orders", "profile"]);
const credentials = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(8).max(200),
  name: z.string().trim().min(2).max(120).optional(),
});
const profileInput = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).nullable().optional(),
  avatarData: z.string().max(700_000).nullable().optional(),
}).superRefine((value, context) => {
  if (value.avatarData && !/^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value.avatarData)) {
    context.addIssue({ code: "custom", path: ["avatarData"], message: "Unsupported avatar" });
  }
});

async function handler(request: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  if (!allowed.has(action)) return Response.json({ detail: "Not found" }, { status: 404 });
  if (request.method !== "GET") {
    const blocked = rejectCrossSiteMutation(request);
    if (blocked) return blocked;
  }
  if ((action === "login" || action === "register") && request.method === "POST") {
    const limited = rateLimit(request, `auth:${action}`, 12, 15 * 60 * 1000);
    if (limited) return limited;
  }
  if (action === "logout") {
    await clearSession();
    return Response.json({ ok: true });
  }
  if (action === "me") {
    const user = await currentUser();
    return user ? Response.json(user) : Response.json({ detail: "Authentication required" }, { status: 401 });
  }
  if (action === "orders") {
    const user = await currentUser();
    if (!user) return Response.json({ detail: "Authentication required" }, { status: 401 });
    const orders = await db.serviceOrder.findMany({
      where: { userId: user.id },
      include: { items: true, stageApprovals: true, review: true },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(orders.map((order) => ({
      id: order.id,
      name: order.name,
      status: order.status,
      payment_status: order.paymentStatus,
      total: order.total,
      currency: order.currency,
      created_at: order.createdAt.toISOString(),
      updated_at: order.updatedAt.toISOString(),
      items: order.items,
      stage_approvals: order.stageApprovals.map((approval) => ({
        stage: approval.stage,
        executor_approved_at: approval.executorApprovedAt?.toISOString() ?? null,
        client_approved_at: approval.clientApprovedAt?.toISOString() ?? null,
      })),
      review: order.review ? { rating: order.review.rating, text: order.review.text, created_at: order.review.createdAt.toISOString() } : null,
    })));
  }
  if (action === "profile") {
    if (request.method !== "PATCH") return Response.json({ detail: "Method not allowed" }, { status: 405 });
    const user = await currentUser();
    if (!user) return Response.json({ detail: "Authentication required" }, { status: 401 });
    const limited = rateLimit(request, `profile:${user.id}`, 30, 10 * 60 * 1000);
    if (limited) return limited;
    const parsed = profileInput.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ detail: "Invalid profile data" }, { status: 400 });
    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        ...(parsed.data.avatarData !== undefined ? { avatarData: parsed.data.avatarData } : {}),
      },
      select: { id: true, name: true, email: true, phone: true, avatarData: true, createdAt: true },
    });
    return Response.json(updated);
  }
  if (request.method !== "POST") return Response.json({ detail: "Method not allowed" }, { status: 405 });
  const parsed = credentials.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ detail: "Invalid account data" }, { status: 400 });
  const { email, password, name } = parsed.data;
  if (action === "register") {
    if (!name) return Response.json({ detail: "Name is required" }, { status: 400 });
    if (await db.user.findUnique({ where: { email }, select: { id: true } })) return Response.json({ detail: "Account already exists" }, { status: 409 });
    const user = await db.user.create({ data: { name, email, passwordHash: await hash(password, 12) }, select: { id: true, name: true, email: true, phone: true, avatarData: true } });
    await createSession(user.id);
    return Response.json(user, { status: 201 });
  }
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await compare(password, user.passwordHash))) return Response.json({ detail: "Invalid email or password" }, { status: 401 });
  await createSession(user.id);
  return Response.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, avatarData: user.avatarData });
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
