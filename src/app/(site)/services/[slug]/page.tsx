import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { services } from "@/lib/site";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { images: [{ url: service.image, alt: service.imageAlt }] },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const Icon = service.icon;

  return (
    <>
      <section className="bg-[#173c32] text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-white/60"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            返回服务能力
          </Link>
          <div className="mt-10 grid items-end gap-10 lg:grid-cols-2">
            <div>
              <Icon className="size-9 text-[#efb58e]" strokeWidth={1.4} aria-hidden="true" />
              <p className="mt-7 text-xs tracking-[0.22em] text-[#efb58e]">{service.eyebrow}</p>
              <h1 className="mt-4 font-serif text-[clamp(2.5rem,1.8rem+2vw,4rem)] leading-tight font-semibold text-balance">
                {service.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/60">
                {service.description}
              </p>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[4px]">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#a15d39]">SERVICE SCOPE</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-[#173c32]">服务范围</h2>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {service.features.map((feature) => (
              <li
                key={feature}
                className="flex min-h-20 items-center gap-3 border border-[#d8ded8] bg-[#f8f8f5] p-5 text-sm text-[#344a43]"
              >
                <Check className="size-5 shrink-0 text-[#a15d39]" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-[#f4f3ee] py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#a15d39]">HOW IT WORKS</p>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-[#173c32]">
            从需求到稳定运营
          </h2>
          <ol className="mt-10 grid gap-px overflow-hidden border border-[#d5dcd6] bg-[#d5dcd6] sm:grid-cols-2 lg:grid-cols-4">
            {service.steps.map((step, index) => (
              <li key={step.title} className="bg-white p-6">
                <span className="font-mono text-xs text-[#a15d39]">STEP 0{index + 1}</span>
                <h3 className="mt-8 font-serif text-xl font-semibold text-[#173c32]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#64716c]">{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-col justify-between gap-6 bg-[#e2e9df] p-7 sm:flex-row sm:items-center">
            <p className="font-serif text-2xl text-[#173c32]">需要针对你的场地进一步讨论？</p>
            <Link
              href="/contact"
              className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-[#173c32] px-6 text-sm text-white"
            >
              获取服务方案 <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
