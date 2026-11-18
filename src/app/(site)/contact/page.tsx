import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "获取团餐与食堂运营方案",
  description: "提交就餐人数、场地与服务需求，获取食堂承包、食材配送或厨房规划方案。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="LET'S TALK"
        title="先把需求说清楚，再谈合适的方案"
        description="无论是新食堂筹建、既有项目交接，还是食材供应协同，都可以从一次具体的沟通开始。"
      />
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-14 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:px-12">
          <ContactForm />
          <aside>
            <h2 className="font-serif text-2xl font-semibold text-[#173c32]">业务联系</h2>
            <p className="mt-4 text-sm leading-7 text-[#64716c]">
              以下均为虚构演示信息，实际业务沟通请使用表单体验完整流程。
            </p>
            <ul className="mt-8 space-y-6">
              {[
                { icon: Phone, label: "联系电话", value: site.phone },
                { icon: Mail, label: "电子邮箱", value: site.email },
                { icon: MapPin, label: "服务区域", value: site.serviceArea },
                { icon: Clock3, label: "建议准备", value: "就餐人数、餐次、场地情况与预算范围" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label} className="flex gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#edf1eb] text-[#a15d39]">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-xs text-[#64716c]">{item.label}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-[#344a43]">{item.value}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
