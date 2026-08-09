import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendLeadEmail } from "@/lib/mail";

const unsafeText = /[<>]|(?:javascript:|data:text\/html|on\w+\s*=)/i;
const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const safeText = (minimum: number, maximum: number) => z.string().trim().min(minimum).max(maximum).refine((value) => !unsafeText.test(value) && !controlCharacters.test(value), "Unsafe text");
const input = z.object({
  name: safeText(2, 120),
  email: z.string().trim().toLowerCase().email().max(160),
  phone: z.string().trim().regex(/^\+[0-9][0-9 ()-]{7,24}$/).max(26).optional().or(z.literal("")),
  company: safeText(2, 200).optional().or(z.literal("")),
  message: safeText(10, 3000),
  source: z.string().trim().regex(/^[a-z0-9_-]+$/i).max(80).default("site"),
});

function admin(request: Request) {
  const token = process.env.AGILE_LEADS_READ_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

function output(lead: { id: string; createdAt: Date; name: string; email: string; phone: string | null; company: string | null; message: string; source: string; status: string }) {
  return { id: lead.id, created_at: lead.createdAt.toISOString(), name: lead.name, email: lead.email, phone: lead.phone, company: lead.company, message: lead.message, source: lead.source, status: lead.status };
}

export async function GET(request: Request) {
  if (!admin(request)) return Response.json({ detail: "Forbidden" }, { status: 403 });
  const limit = Math.min(200, Math.max(1, Number(new URL(request.url).searchParams.get("limit")) || 50));
  return Response.json((await db.lead.findMany({ orderBy: { createdAt: "desc" }, take: limit })).map(output));
}

export async function POST(request: Request) {
  const user = await currentUser();
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ detail: "Invalid request" }, { status: 400 });
  const lead = await db.lead.create({ data: { ...parsed.data, phone: parsed.data.phone || null, company: parsed.data.company || null, userId: user?.id ?? null, name: user?.name ?? parsed.data.name, email: user?.email ?? parsed.data.email } });
  let emailDelivered = false;
  try {
    emailDelivered = await sendLeadEmail(lead);
  } catch (error) {
    console.error("Lead saved, but email notification failed", error instanceof Error ? error.message : "unknown error");
  }
  return Response.json({ ok: true, id: lead.id, emailDelivered }, { status: 201 });
}
