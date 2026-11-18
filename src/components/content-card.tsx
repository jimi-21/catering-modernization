import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getContentPath, type ContentCardData } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function ContentCard({ content }: { content: ContentCardData }) {
  return (
    <article className="group h-full border-t border-[#cfd6d0] pt-5">
      <Link href={getContentPath(content)} className="block">
        <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-[4px] bg-[#dfe4de]">
          {content.coverImage ? (
            <Image
              src={content.coverImage}
              alt={content.coverAlt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.025]"
            />
          ) : null}
          <span className="absolute top-4 right-4 grid size-10 translate-y-1 place-items-center rounded-full bg-white text-[#173c32] opacity-0 shadow-sm transition group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs text-[#596861]">
          <span>{content.category}</span>
          <time dateTime={content.publishedAt?.toISOString()}>
            {formatDate(content.publishedAt)}
          </time>
        </div>
        <h3 className="mt-3 font-serif text-2xl leading-snug font-semibold text-[#173c32] transition group-hover:text-[#a15d39]">
          {content.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#64716c]">{content.excerpt}</p>
      </Link>
    </article>
  );
}
