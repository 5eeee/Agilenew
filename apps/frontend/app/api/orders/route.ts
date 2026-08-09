import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { isLocale, type Locale } from "@/lib/i18n";
import { sendLeadEmail } from "@/lib/mail";
import { getServiceCatalog } from "@/lib/service-catalog";

const input = z.object({
  serviceIds: z.array(z.string().min(1).max(80)).min(1).max(12),
  locale: z.string().default("ru"),
});

function admin(request: Request) {
  const token = process.env.AGILE_LEADS_READ_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

function output(order: {
  id: string;
  userId: string;
  name: string;
  status: string;
  total: number;
  currency: string;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
  items: { id: string; serviceId: string; title: string; price: number; quantity: number }[];
  user?: { name: string; email: string };
}) {
  return {
    id: order.id,
    user_id: order.userId,
    name: order.name,
    status: order.status,
    total: order.total,
    currency: order.currency,
    locale: order.locale,
    created_at: order.createdAt.toISOString(),
    updated_at: order.updatedAt.toISOString(),
    items: order.items,
    ...(order.user ? { customer: order.user } : {}),
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("admin") === "1") {
    if (!admin(request)) return Response.json({ detail: "Forbidden" }, { status: 403 });
    const orders = await db.serviceOrder.findMany({ include: { items: true, user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" }, take: 200 });
    return Response.json(orders.map(output));
  }

  const user = await currentUser();
  if (!user) return Response.json({ detail: "Authentication required" }, { status: 401 });
  const orders = await db.serviceOrder.findMany({ where: { userId: user.id }, include: { items: true }, orderBy: { createdAt: "desc" } });
  return Response.json(orders.map(output));
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ detail: "Authentication required" }, { status: 401 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ detail: "Invalid order" }, { status: 400 });

  const locale = isLocale(parsed.data.locale) ? parsed.data.locale as Locale : "ru";
  const requested = [...new Set(parsed.data.serviceIds)];
  const services = getServiceCatalog(locale).filter((service) => requested.includes(service.id));
  if (services.length !== requested.length) return Response.json({ detail: "Unknown service" }, { status: 400 });

  const total = services.reduce((sum, service) => sum + service.price, 0);
  const name = services.length === 1 ? services[0].title : `${services[0].title} + ${services.length - 1}`;
  const order = await db.serviceOrder.create({
    data: {
      userId: user.id,
      name,
      locale,
      total,
      items: { create: services.map((service) => ({ serviceId: service.id, title: service.title, price: service.price })) },
    },
    include: { items: true },
  });

  const lead = await db.lead.create({
    data: {
      userId: user.id,
      name: user.name,
      email: user.email,
      source: "service_cart",
      message: `Заказ ${order.id}: ${services.map((service) => service.title).join(", ")}. Предварительно: ${total.toLocaleString("ru-RU")} ₽.`,
    },
  });

  try {
    await sendLeadEmail(lead);
  } catch (error) {
    console.error("Order saved, but notification failed", error instanceof Error ? error.message : "unknown error");
  }
  return Response.json(output(order), { status: 201 });
}
