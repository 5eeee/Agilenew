import { z } from "zod";
import { apiError, requireUser } from "@/lib/auth";
import { channelAccess } from "@/lib/access";
import { db } from "@/lib/db";

const input = z.object({ ciphertext: z.string().min(1).max(100000), iv: z.string().min(8).max(200), version: z.number().int().min(1).max(2).default(1) });

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    if (!(await channelAccess(user.id, id))) return Response.json({ detail: "Forbidden" }, { status: 403 });
    const before = new URL(request.url).searchParams.get("before");
    return Response.json(await db.chatMessage.findMany({ where: { channelId: id, ...(before ? { createdAt: { lt: new Date(before) } } : {}) }, include: { sender: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, take: 100 }));
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    if (!(await channelAccess(user.id, id))) return Response.json({ detail: "Forbidden" }, { status: 403 });
    const parsed = input.safeParse(await request.json());
    if (!parsed.success) return Response.json({ detail: "Invalid encrypted message" }, { status: 400 });
    return Response.json(await db.chatMessage.create({ data: { ...parsed.data, channelId: id, senderId: user.id }, include: { sender: { select: { id: true, name: true } } } }), { status: 201 });
  } catch (error) { return apiError(error); }
}
