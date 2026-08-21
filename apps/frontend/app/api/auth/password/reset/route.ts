import { hash } from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPasswordResetToken } from "@/lib/password-reset";
import { rateLimit, rejectCrossSiteMutation } from "@/lib/request-security";

const input = z.object({ token: z.string().min(40).max(2000), password: z.string().min(8).max(200) });

export async function POST(request: Request) {
  const blocked = rejectCrossSiteMutation(request);
  if (blocked) return blocked;
  const limited = rateLimit(request, "password-reset", 8, 15 * 60 * 1000);
  if (limited) return limited;
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ detail: "Invalid reset data" }, { status: 400 });
  const user = await verifyPasswordResetToken(parsed.data.token);
  if (!user) return Response.json({ detail: "Reset link is invalid or expired" }, { status: 400 });
  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { passwordHash: await hash(parsed.data.password, 12) } }),
    db.session.deleteMany({ where: { userId: user.id } }),
  ]);
  return Response.json({ ok: true });
}
