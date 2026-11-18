import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardCheck,
  FileCheck2,
  ScanLine,
} from "lucide-react";
import { ContentCard } from "@/components/content-card";
import { SectionHeading } from "@/components/section-heading";
import { getPublishedContent } from "@/lib/content";
import { services, site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cases, articles] = await Promise.all([
    getPublishedContent("CASE", 3),
    getPublishedContent("ARTICLE", 3),
  ]);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.description,
    areaServed: ["惠州", "惠阳", "大亚湾", "惠城"],
    email: site.email,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="relative overflow-hidden bg-[#f4f3ee]">
        <div className="mx-auto grid max-w-[1440px] items-stretch gap-10 px-5 pt-10 pb-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12 lg:pt-16 lg:pb-24">
          <div className="flex flex-col justify-center">
            <p className="mb-7 flex items-center gap-3 text-xs font-semibold tracking-[0.24em] text-[#8c573a]">
              <span className="size-2 rounded-full bg-[#bd744b]" aria-hidden="true" />
              专注企事业单位团餐服务
            </p>
            <h1 className="max-w-xl font-serif text-[clamp(2.75rem,1.8rem+3.5vw,5.25rem)] leading-[1.13] font-semibold tracking-[-0.045em] text-[#173c32]">
              把一日三餐，
              <br />
              做成值得信任的<span className="whitespace-nowrap text-[#a15d39]">日常。</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-[#5c6c65] sm:text-lg">
              从食堂运营到食材配送，以标准化流程、透明台账和持续复盘，让每一餐的品质清晰可见。
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#174c3e] px-6 text-sm font-medium text-white transition hover:bg-[#0e382d]"
              >
                获取专属供餐方案 <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-medium text-[#173c32] underline decoration-[#aab8b0] underline-offset-8"
              >
                了解服务能力 <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#d6dbd5] pt-6 text-xs leading-5 text-[#64716c] lg:mt-16">
              <span className="flex items-center gap-2">
                <Check className="size-4 text-[#a15d39]" aria-hidden="true" />
                服务流程透明
              </span>
              <span className="flex items-center gap-2">
                <Check className="size-4 text-[#a15d39]" aria-hidden="true" />
                项目按需定制
              </span>
              <span className="flex items-center gap-2">
                <Check className="size-4 text-[#a15d39]" aria-hidden="true" />
                运营持续复盘
              </span>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[3px] sm:min-h-[560px] lg:min-h-[650px]">
            <Image
              src="/images/hero-kitchen.webp"
              alt="厨房团队协同准备餐食"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f28]/55 via-transparent to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between gap-6 p-6 text-white sm:p-8">
              <div>
                <p className="text-xs tracking-[0.18em] text-white/65">SERVICE AREA</p>
                <p className="mt-2 font-serif text-xl">{site.serviceArea}</p>
              </div>
              <a
                href="#services"
                aria-label="向下浏览服务能力"
                className="grid size-12 shrink-0 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm transition hover:bg-white/20"
              >
                <ArrowDown className="size-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-20 bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="WHAT WE DO"
              title="从一顿饭出发，做好整套服务"
              description="不止提供餐食，更围绕场地、人员、供应链和用餐体验，建立可执行、可检查的运营方案。"
            />
            <Link
              href="/services"
              className="inline-flex w-fit items-center gap-2 border-b border-[#9baca3] pb-2 text-sm font-medium text-[#173c32]"
            >
              查看全部服务 <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12 grid border-y border-[#d5dcd6] sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="service-card group relative border-b border-[#d5dcd6] px-1 py-8 sm:px-7 sm:odd:border-r lg:border-r lg:border-b-0 lg:first:pl-1 lg:last:border-r-0"
                >
                  <div className="flex items-center justify-between text-[#5c6c65]">
                    <span className="font-mono text-xs">0{index + 1}</span>
                    <Icon className="size-6 text-[#a15d39]" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="mt-10 font-serif text-2xl leading-snug font-semibold text-[#173c32]">
                    {service.title}
                  </h3>
                  <p className="mt-4 min-h-20 text-sm leading-7 text-[#64716c]">
                    {service.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-[#173c32]">
                    了解更多{" "}
                    <ArrowRight
                      className="size-4 transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#173c32] py-20 text-white lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-12">
          <div>
            <SectionHeading
              light
              eyebrow="VISIBLE OPERATIONS"
              title="管理不靠口号，过程都有记录"
              description="把抽象的“放心”拆成每天可执行的动作：采购有来源、验收有标准、出品有检查、反馈有跟进。"
            />
            <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[3px] lg:block">
              <Image
                src="/images/produce-market.webp"
                alt="按品类陈列的新鲜蔬菜"
                fill
                sizes="40vw"
                className="object-cover opacity-85"
              />
            </div>
          </div>
          <ol className="divide-y divide-white/15 border-y border-white/15">
            {[
              {
                icon: FileCheck2,
                title: "供应来源可追溯",
                text: "供应商资料、采购订单与到货批次统一留存，出现问题时能够快速定位。",
              },
              {
                icon: ScanLine,
                title: "关键环节有检查",
                text: "围绕收货、储存、加工和留样设置检查项，让标准落实到每个班次。",
              },
              {
                icon: ClipboardCheck,
                title: "运营结果可复盘",
                text: "通过日报、满意度与剩菜反馈发现偏差，形成下一周期的改进清单。",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="grid gap-5 py-8 sm:grid-cols-[48px_1fr_auto] sm:items-start sm:py-10"
                >
                  <span className="grid size-12 place-items-center rounded-full border border-white/20 text-[#efb58e]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl font-medium">{item.title}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-white/55">{item.text}</p>
                  </div>
                  <span className="hidden font-mono text-xs text-white/65 sm:block">
                    0{index + 1}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-[#f4f3ee] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="SELECTED CASES"
              title="用场景，说明服务如何落地"
              description="以下为虚构演示案例，用于展示不同供餐场景下的方案组织方式。"
            />
            <Link
              href="/cases"
              className="inline-flex w-fit items-center gap-2 border-b border-[#9baca3] pb-2 text-sm font-medium text-[#173c32]"
            >
              浏览项目案例 <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="INSIGHTS" title="把经验沉淀为可复用的方法" />
            <Link
              href="/insights"
              className="inline-flex w-fit items-center gap-2 border-b border-[#9baca3] pb-2 text-sm font-medium text-[#173c32]"
            >
              查看全部文章 <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e4e9df]">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:px-12 lg:py-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#8c573a]">
              START A CONVERSATION
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-[#173c32] sm:text-4xl">
              你的食堂，也值得一套清晰的方案。
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-14 w-fit shrink-0 items-center gap-4 rounded-full bg-[#173c32] px-7 text-sm font-medium text-white transition hover:bg-[#0e382d]"
          >
            告诉我们你的需求 <ArrowUpRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
