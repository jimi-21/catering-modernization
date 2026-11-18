import type { MetadataRoute } from "next";
import { getContentPath } from "@/lib/content";
import { db } from "@/lib/db";
import { getSiteUrl, services } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const content = await db.content.findMany({
    where: { status: "PUBLISHED" },
    select: { kind: true, slug: true, updatedAt: true },
  });
  const staticPages = ["", "/services", "/cases", "/insights", "/about", "/contact"];
  return [
    ...staticPages.map((route) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.8,
    })),
    ...services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...content.map((item) => ({
      url: `${baseUrl}${getContentPath(item)}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: item.kind === "PAGE" ? 0.6 : 0.7,
    })),
  ];
}
