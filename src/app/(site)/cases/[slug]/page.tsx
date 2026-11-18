import type { Metadata } from "next";
import { PublishedContentPage } from "@/components/published-content-page";
import { getPublishedBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const content = await getPublishedBySlug("CASE", (await params).slug);
  if (!content) return {};
  return {
    title: content.seoTitle ?? content.title,
    description: content.seoDescription ?? content.excerpt,
    alternates: { canonical: `/cases/${content.slug}` },
    openGraph: {
      type: "article",
      publishedTime: content.publishedAt?.toISOString(),
      images: content.coverImage
        ? [{ url: content.coverImage, alt: content.coverAlt ?? content.title }]
        : undefined,
    },
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const content = await getPublishedBySlug("CASE", (await params).slug);
  return <PublishedContentPage content={content} backHref="/cases" backLabel="返回项目案例" />;
}
