import type { Metadata } from "next";
import { Search } from "lucide-react";
import { ContentCard } from "@/components/content-card";
import { PageHero } from "@/components/page-hero";
import { db } from "@/lib/db";
import { contentCardSelect } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "食安观察与团餐运营方法",
  description: "分享食堂交接、菜单管理、食材验收与厨房动线规划的可执行方法。",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q?.trim().slice(0, 60) ?? "";
  const articles = await db.content.findMany({
    where: {
      kind: "ARTICLE",
      status: "PUBLISHED",
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { excerpt: { contains: q } },
              { category: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: contentCardSelect,
  });

  return (
    <>
      <PageHero
        eyebrow="INSIGHTS & METHODS"
        title="把现场经验，写成能执行的步骤"
        description="关注食堂运营中反复出现的问题，用清单、流程与复盘方法减少模糊地带。"
      />
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <search className="mb-12 ml-auto max-w-xl">
            <form
              action="/insights"
              method="get"
              className="flex gap-3"
              aria-labelledby="article-search-label"
            >
              <div className="flex-1">
                <label
                  id="article-search-label"
                  htmlFor="article-q"
                  className="mb-2 block text-sm font-medium text-[#344a43]"
                >
                  搜索文章
                </label>
                <input
                  id="article-q"
                  name="q"
                  type="search"
                  defaultValue={q}
                  maxLength={60}
                  autoComplete="off"
                  placeholder="输入标题、摘要或栏目"
                  className="min-h-12 w-full rounded-full border border-[#bdc8c2] bg-white px-5 text-base outline-none focus:border-[#174c3e] focus:ring-3 focus:ring-[#174c3e]/15"
                />
              </div>
              <button
                type="submit"
                className="mt-7 inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-[#173c32] px-5 text-sm text-white"
              >
                <Search className="size-4" aria-hidden="true" />
                搜索
              </button>
            </form>
          </search>
          <div aria-live="polite">
            {q ? (
              <p className="mb-8 text-sm text-[#64716c]">
                “{q}”的搜索结果：{articles.length} 篇
              </p>
            ) : null}
          </div>
          {articles.length ? (
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          ) : (
            <div className="border-y border-[#d5dcd6] py-16 text-center">
              <p className="font-serif text-2xl text-[#173c32]">没有找到相关内容</p>
              <p className="mt-3 text-sm text-[#64716c]">
                试试更短的关键词，或清空搜索查看全部文章。
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
