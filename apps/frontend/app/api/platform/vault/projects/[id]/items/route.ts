import { z } from "zod";
import { apiError, requireUser } from "@/lib/auth";
import { vaultAccess } from "@/lib/access";
import { db } from "@/lib/db";

const input = z.object({ kind: z.enum(["WEBSITE", "EMAIL", "API", "SERVER", "DATABASE", "OTHER"]), titleCiphertext: z.string().min(1).max(10000), titleIv: z.string().min(8).max(200), payloadCiphertext: z.string().min(1).max(100000), payloadIv: z.string().min(8).max(200) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    if (!(await vaultAccess(user.id, id, true))) return Response.json({ detail: "Forbidden" }, { status: 403 });
    const parsed = input.safeParse(await request.json());
    if (!parsed.success) return Response.json({ detail: "Invalid encrypted item" }, { status: 400 });
    return Response.json(await db.vaultItem.create({ data: { ...parsed.data, projectId: id, createdById: user.id } }), { status: 201 });
  } catch (error) { return apiError(error); }
}
