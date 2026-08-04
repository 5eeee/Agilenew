import { z } from "zod";
import { apiError, requireUser } from "@/lib/auth";
import { companyAccess } from "@/lib/access";
import { db } from "@/lib/db";

const input = z.object({ nameCiphertext: z.string().min(1).max(10000), nameIv: z.string().min(8).max(200), kdfSalt: z.string().min(8).max(200), companyId: z.string().uuid().nullable().optional() });

export async function GET() {
  try {
    const user = await requireUser();
    return Response.json(await db.vaultProject.findMany({ where: { OR: [{ ownerId: user.id }, { company: { members: { some: { userId: user.id } } } }] }, include: { items: true }, orderBy: { updatedAt: "desc" } }));
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const parsed = input.safeParse(await request.json());
    if (!parsed.success) return Response.json({ detail: "Invalid encrypted project" }, { status: 400 });
    if (parsed.data.companyId && !(await companyAccess(user.id, parsed.data.companyId, true))) return Response.json({ detail: "Forbidden" }, { status: 403 });
    return Response.json(await db.vaultProject.create({ data: { ...parsed.data, companyId: parsed.data.companyId ?? null, ownerId: user.id } }), { status: 201 });
  } catch (error) { return apiError(error); }
}
