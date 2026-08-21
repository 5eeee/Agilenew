import { z } from "zod";
import { db } from "@/lib/db";
import { createPasswordResetToken } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/mail";
import { rateLimit, rejectCrossSiteMutation } from "@/lib/request-security";

const input = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  locale: z.enum(["ru", "en", "ka", "hy", "bg"]).default("en"),
});

export async function POST(request: Request) {
  const blocked = rejectCrossSiteMutation(request);
  if (blocked) return blocked;
  const limited = rateLimit(request, "password-request", 5, 15 * 60 * 1000);
  if (limited) return limited;
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ detail: "Invalid email" }, { status: 400 });
  const user = await db.user.findUnique({ where: { email: parsed.data.email }, select: { id: true, name: true, email: true, passwordHash: true } });
  if (user) {
    try {
      const token = createPasswordResetToken(user);
      const origin = new URL(request.url).origin;
      const url = `${origin}/${parsed.data.locale}/account?reset=${encodeURIComponent(token)}`;
      await sendPasswordResetEmail({ to: user.email, name: user.name, url, locale: parsed.data.locale });
    } catch (error) {
      console.error("Password reset delivery failed", error instanceof Error ? error.message : "unknown error");
    }
  }
  return Response.json({ ok: true });
}
