import type { Metadata } from "next";
import { PublishedContentPage } from "@/components/published-content-page";
import { getPublishedBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const content = await getPublishedBySlug("ARTICLE", (await params).slug);
  if (!content) return {};
  return {
    title: content.seoTitle ?? content.title,
    description: content.seoDescription ?? content.excerpt,
    alternates: { canonical: `/insights/${content.slug}` },
    openGraph: {
      type: "article",
      publishedTime: content.publishedAt?.toISOString(),
      modifiedTime: content.updatedAt.toISOString(),
      images: content.coverImage
        ? [{ url: content.coverImage, alt: content.coverAlt ?? content.title }]
        : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const content = await getPublishedBySlug("ARTICLE", (await params).slug);
  return <PublishedContentPage content={content} backHref="/insights" backLabel="返回食安观察" />;
}
