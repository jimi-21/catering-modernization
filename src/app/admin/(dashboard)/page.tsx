import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FilePlus2, Globe2, MessageSquareText } from "lucide-react";
import { db } from "@/lib/db";
import { getContentPath } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "后台概览", robots: { index: false, follow: false } };

export default async function AdminDashboard() {
  const [published, drafts, newInquiries, recent] = await Promise.all([
    db.content.count({ where: { status: "PUBLISHED" } }),
    db.content.count({ where: { status: "DRAFT" } }),
    db.inquiry.count({ where: { status: "NEW" } }),
    db.content.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        kind: true,
        slug: true,
        title: true,
        category: true,
        status: true,
        updatedAt: true,
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#a15d39]">DASHBOARD</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#18352e]">内容概览</h1>
          <p className="mt-2 text-sm text-[#5c6963]">管理官网内容与最新咨询。</p>
        </div>
        <Link
          href="/admin/content/new"
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-[#174c3e] px-4 text-sm font-medium text-white"
        >
          <FilePlus2 className="size-4" aria-hidden="true" />
          新建内容
        </Link>
      </div>
      <section aria-labelledby="summary-title" className="mt-8">
        <h2 id="summary-title" className="sr-only">
          内容统计
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "已发布内容", value: published, icon: Globe2 },
            { label: "待完善草稿", value: drafts, icon: FilePlus2 },
            { label: "未处理咨询", value: newInquiries, icon: MessageSquareText },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-[#dce1dc] bg-white p-5">
                <div className="flex items-center justify-between text-[#5c6963]">
                  <h3 className="text-sm">{item.label}</h3>
                  <Icon className="size-5 text-[#a15d39]" aria-hidden="true" />
                </div>
                <p className="mt-5 text-3xl font-semibold text-[#18352e]">{item.value}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section
        aria-labelledby="recent-title"
        className="mt-9 rounded-xl border border-[#dce1dc] bg-white"
      >
        <div className="flex items-center justify-between border-b border-[#e4e8e3] px-5 py-4">
          <h2 id="recent-title" className="font-semibold text-[#18352e]">
            最近更新
          </h2>
          <Link
            href="/admin/content"
            className="inline-flex min-h-9 items-center gap-1 text-xs text-[#53625d]"
          >
            全部内容 <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        <ul className="divide-y divide-[#e7eae6]">
          {recent.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/content/${item.id}`}
                  className="block truncate text-sm font-medium text-[#18352e] hover:text-[#a15d39]"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-xs text-[#64716c]">
                  {item.category} · 更新于 {formatDate(item.updatedAt)}
                </p>
              </div>
              <span
                className={`w-fit rounded-full px-2.5 py-1 text-xs ${item.status === "PUBLISHED" ? "bg-[#e5f1e7] text-[#2c6643]" : "bg-[#f1eee3] text-[#806631]"}`}
              >
                {item.status === "PUBLISHED" ? "已发布" : "草稿"}
              </span>
              {item.status === "PUBLISHED" ? (
                <Link
                  href={getContentPath(item)}
                  target="_blank"
                  className="inline-flex min-h-9 items-center gap-1 text-xs text-[#53625d]"
                >
                  预览 <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              ) : (
                <span className="inline-flex min-h-9 items-center text-xs text-[#64716c]">
                  发布后预览
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
