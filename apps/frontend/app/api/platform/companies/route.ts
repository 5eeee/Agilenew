import { z } from "zod";
import { apiError, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const input = z.object({ name: z.string().trim().min(2).max(160), type: z.enum(["LLC", "JSC", "SOLE_PROPRIETOR", "SELF_EMPLOYED", "STARTUP", "INDIVIDUAL"]) });

export async function GET() {
  try {
    const user = await requireUser();
    return Response.json(await db.company.findMany({
      where: { members: { some: { userId: user.id } } },
      include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
      orderBy: { createdAt: "desc" },
    }));
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const parsed = input.safeParse(await request.json());
    if (!parsed.success) return Response.json({ detail: "Invalid company data" }, { status: 400 });
    const company = await db.$transaction(async tx => {
      const created = await tx.company.create({ data: { ...parsed.data, ownerId: user.id } });
      await tx.companyMember.create({ data: { companyId: created.id, userId: user.id, role: "OWNER" } });
      const channel = await tx.chatChannel.create({ data: { name: "Общий чат", type: "COMPANY", companyId: created.id, createdById: user.id } });
      await tx.chatParticipant.create({ data: { channelId: channel.id, userId: user.id } });
      return created;
    });
    return Response.json(company, { status: 201 });
  } catch (error) { return apiError(error); }
}
