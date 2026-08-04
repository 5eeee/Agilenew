import { z } from "zod";
import { db } from "@/lib/db";
import { mailStatus, sendTestEmail } from "@/lib/mail";

function admin(request: Request) {
  const token = process.env.AGILE_LEADS_READ_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

const statusInput = z.object({ status: z.enum(["new", "in_progress", "completed", "cancelled"]) });

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if (!admin(request)) return Response.json({ detail: "Forbidden" }, { status: 403 });
  const { path } = await params;
  if (path.join("/") !== "email/status") return Response.json({ detail: "Not found" }, { status: 404 });
  return Response.json(mailStatus());
}

export async function PATCH(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if (!admin(request)) return Response.json({ detail: "Forbidden" }, { status: 403 });
  const { path } = await params;
  if (path.length !== 2 || path[1] !== "status") return Response.json({ detail: "Not found" }, { status: 404 });
  const parsed = statusInput.safeParse(await request.json());
  if (!parsed.success) return Response.json({ detail: "Invalid status" }, { status: 400 });
  try { return Response.json(await db.lead.update({ where: { id: path[0] }, data: { status: parsed.data.status } })); } catch { return Response.json({ detail: "Lead not found" }, { status: 404 }); }
}

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if (!admin(request)) return Response.json({ detail: "Forbidden" }, { status: 403 });
  const { path } = await params;
  if (path.join("/") !== "email/test") return Response.json({ detail: "Not found" }, { status: 404 });
  if (!mailStatus().configured) return Response.json({ detail: "SMTP is not fully configured" }, { status: 503 });
  try {
    await sendTestEmail();
    return Response.json({ ok: true });
  } catch (error) {
    console.error("SMTP test failed", error instanceof Error ? error.message : "unknown error");
    return Response.json({ detail: "SMTP delivery failed" }, { status: 502 });
  }
}
