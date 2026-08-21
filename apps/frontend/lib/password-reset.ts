import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";

const RESET_LIFETIME_MS = 30 * 60 * 1000;

function resetSecret() {
  const secret = process.env.AGILE_PASSWORD_RESET_SECRET;
  if (!secret || secret.length < 32) throw new Error("PASSWORD_RESET_NOT_CONFIGURED");
  return secret;
}

function sign(payload: string, passwordHash: string) {
  return createHmac("sha256", resetSecret()).update(`${payload}.${passwordHash}`).digest("base64url");
}

export function createPasswordResetToken(user: { id: string; passwordHash: string }) {
  const payload = Buffer.from(JSON.stringify({
    userId: user.id,
    expiresAt: Date.now() + RESET_LIFETIME_MS,
    nonce: randomBytes(12).toString("base64url"),
  })).toString("base64url");
  return `${payload}.${sign(payload, user.passwordHash)}`;
}

export async function verifyPasswordResetToken(token: string) {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;

  let parsed: { userId?: string; expiresAt?: number };
  try {
    parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!parsed.userId || !parsed.expiresAt || parsed.expiresAt < Date.now()) return null;

  const user = await db.user.findUnique({
    where: { id: parsed.userId },
    select: { id: true, email: true, name: true, passwordHash: true },
  });
  if (!user) return null;
  const expected = Buffer.from(sign(payload, user.passwordHash));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  return user;
}
