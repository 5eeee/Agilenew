import { z } from "zod";
import { apiError, requireUser } from "@/lib/auth";
import { companyAccess } from "@/lib/access";
import { db } from "@/lib/db";

const input = z.object({ email: z.string().trim().toLowerCase().email(), role: z.enum(["ADMIN", "EMPLOYEE"]).default("EMPLOYEE") });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireUser();
    const { id } = await params;
    if (!(await companyAccess(actor.id, id, true))) return Response.json({ detail: "Forbidden" }, { status: 403 });
    const parsed = input.safeParse(await request.json());
    if (!parsed.success) return Response.json({ detail: "Invalid member data" }, { status: 400 });
    const user = await db.user.findUnique({ where: { email: parsed.data.email }, select: { id: true, name: true, email: true } });
    if (!user) return Response.json({ detail: "Пользователь должен сначала зарегистрироваться" }, { status: 404 });
    await db.$transaction(async tx => {
      await tx.companyMember.upsert({ where: { companyId_userId: { companyId: id, userId: user.id } }, create: { companyId: id, userId: user.id, role: parsed.data.role }, update: { role: parsed.data.role } });
      const channels = await tx.chatChannel.findMany({ where: { companyId: id, type: "COMPANY" }, select: { id: true } });
      await Promise.all(channels.map(channel => tx.chatParticipant.upsert({ where: { channelId_userId: { channelId: channel.id, userId: user.id } }, create: { channelId: channel.id, userId: user.id }, update: {} })));
    });
    return Response.json(user);
  } catch (error) { return apiError(error); }
}
