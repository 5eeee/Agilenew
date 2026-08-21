type Bucket = { count: number; resetAt: number };

const globalSecurity = globalThis as unknown as { agileRateLimits?: Map<string, Bucket> };
const buckets = globalSecurity.agileRateLimits ?? new Map<string, Bucket>();
if (process.env.NODE_ENV !== "production") globalSecurity.agileRateLimits = buckets;

function clientAddress(request: Request) {
  return (request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim();
}

export function rateLimit(request: Request, scope: string, maximum: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
  }
  const key = `${scope}:${clientAddress(request)}`;
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  current.count += 1;
  if (current.count <= maximum) return null;
  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
  return Response.json({ detail: "Too many requests" }, { status: 429, headers: { "retry-after": String(retryAfter) } });
}

export function rejectCrossSiteMutation(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  const origin = request.headers.get("origin");
  if (origin) {
    const requestHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || new URL(request.url).host;
    if (new URL(origin).host !== requestHost) return Response.json({ detail: "Origin not allowed" }, { status: 403 });
    return null;
  }
  if (fetchSite === "cross-site") return Response.json({ detail: "Cross-site request blocked" }, { status: 403 });
  return null;
}
