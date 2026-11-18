import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { services } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "食堂承包、食材配送与厨房设计服务",
  description: "了解衡膳演示项目的食堂承包、食材配送、厨房规划与菜单管理服务能力。",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="OUR CAPABILITIES"
        title="服务，应与你的场景匹配"
        description="从供餐规模、场地条件和预算边界出发，组合真正需要的运营能力，不用固定套餐替代实际需求。"
      />
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] space-y-20 px-5 sm:px-8 lg:px-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article
                key={service.slug}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-[4px] ${index % 2 ? "lg:order-2" : ""}`}
                >
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-4 text-[#a15d39]">
                    <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                    <span className="font-mono text-xs">0{index + 1} / 04</span>
                  </div>
                  <h2 className="mt-6 font-serif text-3xl font-semibold text-[#173c32] sm:text-4xl">
                    {service.title}
                  </h2>
                  <p className="mt-5 text-base leading-8 text-[#64716c]">{service.description}</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-[#44574f]">
                        <Check className="size-4 shrink-0 text-[#a15d39]" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-8 inline-flex min-h-11 items-center gap-2 border-b border-[#9baca3] pb-1 text-sm font-medium text-[#173c32]"
                  >
                    查看服务流程 <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
