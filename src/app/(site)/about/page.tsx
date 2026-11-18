import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye, RefreshCw, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "品牌理念与工作方法",
  description: "了解衡膳演示品牌的服务理念、工作方法与项目边界。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT HENGSHAN"
        title="认真对待日常，才能经得起长期检验"
        description="衡膳是为老站改造作品创建的原创虚构品牌。我们以真实的业务逻辑组织内容，而不虚构客户数量、资质或经营历史。"
      />
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]">
            <Image
              src="/images/chef-service.webp"
              alt="厨师专注完成餐食出品"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          <div>
            <SectionHeading eyebrow="OUR BELIEF" title="一顿饭很小，背后的协作并不简单" />
            <div className="mt-6 space-y-5 text-base leading-8 text-[#64716c]">
              <p>
                稳定的团餐服务来自许多细节：一份准确的采购单、一次不省略的验收、一张被认真复核的菜单，以及一条有人跟进的反馈。
              </p>
              <p>
                因此，我们不以夸张数字证明专业，而把服务拆成可讨论的流程、可检查的清单和可持续改进的记录。
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f4f3ee] py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="WORKING PRINCIPLES" title="三个不变的工作原则" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "让过程可见",
                text: "需求、边界、执行与结果尽量形成记录，让合作双方对当前状态有共同理解。",
              },
              {
                icon: Users,
                title: "从使用者出发",
                text: "同时考虑管理者、现场团队与就餐者，避免方案只对其中一方友好。",
              },
              {
                icon: RefreshCw,
                title: "允许持续修正",
                text: "把反馈和偏差作为改进输入，而不是用一份固定方案覆盖所有变化。",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="border-t border-[#bfc9c1] bg-white p-7">
                  <Icon className="size-7 text-[#a15d39]" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-10 font-serif text-2xl font-semibold text-[#173c32]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#64716c]">{item.text}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-14 flex flex-col justify-between gap-6 border-t border-[#c8d0c9] pt-8 sm:flex-row sm:items-center">
            <p className="max-w-xl text-sm leading-7 text-[#64716c]">
              想进一步了解这个独立演示项目的功能与技术实现，可前往 GitHub 查看源码和迁移工具。
            </p>
            <Link
              href="/contact"
              className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-[#173c32] px-6 text-sm text-white"
            >
              体验咨询流程 <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
