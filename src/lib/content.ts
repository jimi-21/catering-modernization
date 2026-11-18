import type { Content, Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export const CONTENT_KINDS = ["ARTICLE", "CASE", "PAGE"] as const;
export const CONTENT_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export const CONTENT_TEMPLATES = ["STANDARD", "FEATURE"] as const;

export type ContentKind = (typeof CONTENT_KINDS)[number];
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export function getContentPath(content: Pick<Content, "kind" | "slug">) {
  if (content.kind === "CASE") return `/cases/${content.slug}`;
  if (content.kind === "PAGE") return `/pages/${content.slug}`;
  return `/insights/${content.slug}`;
}

export const contentCardSelect = {
  id: true,
  kind: true,
  slug: true,
  title: true,
  excerpt: true,
  category: true,
  coverImage: true,
  coverAlt: true,
  publishedAt: true,
} satisfies Prisma.ContentSelect;

export type ContentCardData = Prisma.ContentGetPayload<{ select: typeof contentCardSelect }>;

export async function getPublishedContent(kind: ContentKind, limit?: number) {
  return db.content.findMany({
    where: { kind, status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: contentCardSelect,
    take: limit,
  });
}

export async function getPublishedBySlug(kind: ContentKind, slug: string) {
  return db.content.findFirst({
    where: { kind, slug, status: "PUBLISHED" },
  });
}
