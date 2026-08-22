import { db } from "@/lib/db";

export type PublishedProjectDetails = {
  title: string | null;
  summary: string | null;
  review: { rating: number; text: string; author: string; role: string | null } | null;
};

export async function getPublishedProjectDetails(slug: string): Promise<PublishedProjectDetails | null> {
  try {
    const order = await db.serviceOrder.findFirst({
      where: { projectSlug: slug, publishedAt: { not: null }, status: "COMPLETED" },
      select: {
        publicTitle: true,
        publicSummary: true,
        user: { select: { name: true } },
        review: { select: { rating: true, text: true, publicText: true, clientRole: true, status: true, publishedAt: true } },
      },
    });
    if (!order) return null;
    const review = order.review?.status === "APPROVED" && order.review.publishedAt
      ? { rating: order.review.rating, text: order.review.publicText || order.review.text, author: order.user.name, role: order.review.clientRole }
      : null;
    return { title: order.publicTitle, summary: order.publicSummary, review };
  } catch (error) {
    console.error("Published project details unavailable", error instanceof Error ? error.message : "unknown error");
    return null;
  }
}
