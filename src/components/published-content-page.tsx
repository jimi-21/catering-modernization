import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import type { Content } from "@prisma/client";
import { ContentBody } from "@/components/content-body";
import { formatDate, readingTime } from "@/lib/utils";

export function PublishedContentPage({
  content,
  backHref,
  backLabel,
}: {
  content: Content | null;
  backHref: string;
  backLabel: string;
}) {
  if (!content) notFound();
  const feature = content.template === "FEATURE";

  return (
    <article>
      <header className={feature ? "bg-[#173c32] text-white" : "bg-[#f4f3ee] text-[#173c32]"}>
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <Link
            href={backHref}
            className={`inline-flex min-h-11 items-center gap-2 text-sm ${feature ? "text-white/65" : "text-[#64716c]"}`}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {backLabel}
          </Link>
          <p
            className={`mt-10 mb-5 text-xs font-semibold tracking-[0.2em] ${feature ? "text-[#efb58e]" : "text-[#a15d39]"}`}
          >
            {content.category}
          </p>
          <h1 className="font-serif text-[clamp(2.25rem,1.6rem+3vw,4.25rem)] leading-tight font-semibold tracking-tight text-balance">
            {content.title}
          </h1>
          <p
            className={`mt-6 max-w-3xl text-base leading-8 ${feature ? "text-white/65" : "text-[#64716c]"}`}
          >
            {content.excerpt}
          </p>
          <div
            className={`mt-8 flex flex-wrap items-center gap-5 text-xs ${feature ? "text-white/65" : "text-[#64716c]"}`}
          >
            <time dateTime={content.publishedAt?.toISOString()}>
              {formatDate(content.publishedAt)}
            </time>
            <span className="flex items-center gap-1.5">
              <Clock3 className="size-3.5" aria-hidden="true" />约 {readingTime(content.body)}{" "}
              分钟阅读
            </span>
          </div>
        </div>
      </header>
      {content.coverImage ? (
        <div className={feature ? "bg-[#173c32]" : "bg-[#f4f3ee]"}>
          <div className="relative mx-auto aspect-[16/8] max-w-6xl overflow-hidden px-0 sm:mx-8 lg:mx-auto lg:rounded-[4px]">
            <Image
              src={content.coverImage}
              alt={content.coverAlt ?? ""}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_180px] lg:px-12 lg:py-24">
        <ContentBody body={content.body} />
        <aside className="h-fit min-w-0 border-t border-[#d5dcd6] pt-5 lg:sticky lg:top-8">
          <h2 className="text-xs font-semibold tracking-[0.16em] text-[#64716c]">需要相关服务？</h2>
          <p className="mt-3 text-sm leading-6 text-[#64716c]">把你的场地、人数与目标告诉我们。</p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#173c32]"
          >
            联系衡膳 <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </article>
  );
}
