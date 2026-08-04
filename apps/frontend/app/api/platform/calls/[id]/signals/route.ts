import { z } from "zod";
import { apiError, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const input = z.object({ type: z.enum(["offer", "answer", "ice", "hangup"]), payload: z.unknown() });

async function allowed(userId: string, callId: string) {
  return db.call.findFirst({ where: { id: callId, OR: [{ callerId: userId }, { calleeId: userId }] }, select: { id: true } });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    if (!(await allowed(user.id, id))) return Response.json({ detail: "Not found" }, { status: 404 });
    const after = new URL(request.url).searchParams.get("after");
    return Response.json(await db.callSignal.findMany({ where: { callId: id, senderId: { not: user.id }, ...(after ? { createdAt: { gt: new Date(after) } } : {}) }, orderBy: { createdAt: "asc" }, take: 200 }));
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    if (!(await allowed(user.id, id))) return Response.json({ detail: "Not found" }, { status: 404 });
    const parsed = input.safeParse(await request.json());
    if (!parsed.success) return Response.json({ detail: "Invalid signal" }, { status: 400 });
    return Response.json(await db.callSignal.create({ data: { callId: id, senderId: user.id, type: parsed.data.type, payload: parsed.data.payload as object } }), { status: 201 });
  } catch (error) { return apiError(error); }
}
