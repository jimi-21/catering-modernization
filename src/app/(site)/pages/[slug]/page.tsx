import type { Metadata } from "next";
import { PublishedContentPage } from "@/components/published-content-page";
import { getPublishedBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const content = await getPublishedBySlug("PAGE", (await params).slug);
  if (!content) return {};
  return {
    title: content.seoTitle ?? content.title,
    description: content.seoDescription ?? content.excerpt,
    alternates: { canonical: `/pages/${content.slug}` },
  };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const content = await getPublishedBySlug("PAGE", (await params).slug);
  return <PublishedContentPage content={content} backHref="/" backLabel="返回首页" />;
}
