import { z } from "zod";
import { apiError, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const input = z.object({ calleeEmail: z.string().trim().toLowerCase().email(), video: z.boolean().default(false) });

export async function GET() {
  try {
    const user = await requireUser();
    return Response.json(await db.call.findMany({ where: { OR: [{ callerId: user.id }, { calleeId: user.id }], status: { in: ["RINGING", "ACTIVE"] } }, include: { caller: { select: { id: true, name: true, email: true } }, callee: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "desc" } }));
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const parsed = input.safeParse(await request.json());
    if (!parsed.success) return Response.json({ detail: "Invalid call data" }, { status: 400 });
    const callee = await db.user.findUnique({ where: { email: parsed.data.calleeEmail }, select: { id: true } });
    if (!callee || callee.id === user.id) return Response.json({ detail: "Callee not found" }, { status: 404 });
    return Response.json(await db.call.create({ data: { callerId: user.id, calleeId: callee.id, video: parsed.data.video } }), { status: 201 });
  } catch (error) { return apiError(error); }
}
