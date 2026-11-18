import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import { PageHero } from "@/components/page-hero";
import { getPublishedContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "团餐运营与食堂服务演示案例",
  description: "通过虚构演示案例，了解不同供餐场景的方案组织、运营流程与服务交付。",
  alternates: { canonical: "/cases" },
};

export default async function CasesPage() {
  const cases = await getPublishedContent("CASE");
  return (
    <>
      <PageHero
        eyebrow="SELECTED CASES"
        title="把方案放进真实问题里检验"
        description="案例内容不仅展示图片，也说明背景、约束、行动与交付。当前所有案例均为原创虚构演示。"
      />
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          {cases.length ? (
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          ) : (
            <p className="text-[#64716c]">案例正在整理中。</p>
          )}
        </div>
      </section>
    </>
  );
}
