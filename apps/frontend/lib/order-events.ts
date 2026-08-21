type OrderEvent = {
  type: "order.created" | "order.status_changed";
  order: Record<string, unknown>;
  customer: { id: string; name: string; email: string };
};

export async function notifyOrderPlatform(event: OrderEvent) {
  const url = process.env.AGILE_ORDER_WEBHOOK_URL;
  if (!url) return false;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.AGILE_ORDER_WEBHOOK_SECRET
        ? { authorization: `Bearer ${process.env.AGILE_ORDER_WEBHOOK_SECRET}` }
        : {}),
    },
    body: JSON.stringify(event),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`ORDER_WEBHOOK_${response.status}`);
  return true;
}
