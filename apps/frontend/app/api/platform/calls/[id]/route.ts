import { z } from "zod";
import { apiError, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const input = z.object({ action: z.enum(["accept", "decline", "end"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const call = await db.call.findUnique({ where: { id } });
    if (!call || (call.callerId !== user.id && call.calleeId !== user.id)) return Response.json({ detail: "Not found" }, { status: 404 });
    const parsed = input.safeParse(await request.json());
    if (!parsed.success) return Response.json({ detail: "Invalid action" }, { status: 400 });
    if (parsed.data.action === "accept" && call.calleeId !== user.id) return Response.json({ detail: "Forbidden" }, { status: 403 });
    const data = parsed.data.action === "accept" ? { status: "ACTIVE" as const, answeredAt: new Date() } : parsed.data.action === "decline" ? { status: "DECLINED" as const, endedAt: new Date() } : { status: "ENDED" as const, endedAt: new Date() };
    return Response.json(await db.call.update({ where: { id }, data }));
  } catch (error) { return apiError(error); }
}
