import { z } from "zod";
import { apiError, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const input = z.object({ name: z.string().trim().min(1).max(120), participantEmails: z.array(z.string().trim().toLowerCase().email()).min(1).max(100) });

export async function GET() {
  try {
    const user = await requireUser();
    return Response.json(await db.chatChannel.findMany({
      where: { participants: { some: { userId: user.id } } },
      include: { participants: { include: { user: { select: { id: true, name: true, email: true } } } }, messages: { orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }));
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const parsed = input.safeParse(await request.json());
    if (!parsed.success) return Response.json({ detail: "Invalid chat data" }, { status: 400 });
    const users = await db.user.findMany({ where: { email: { in: parsed.data.participantEmails } }, select: { id: true } });
    if (users.length !== new Set(parsed.data.participantEmails).size) return Response.json({ detail: "Some users are not registered" }, { status: 404 });
    const ids = [...new Set([user.id, ...users.map(item => item.id)])];
    const channel = await db.chatChannel.create({ data: { name: parsed.data.name, type: ids.length === 2 ? "DIRECT" : "GROUP", createdById: user.id, participants: { create: ids.map(userId => ({ userId })) } } });
    return Response.json(channel, { status: 201 });
  } catch (error) { return apiError(error); }
}
