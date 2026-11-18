import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FilePlus2, Pencil, Search } from "lucide-react";
import { getContentPath } from "@/lib/content";
import { Pagination } from "@/components/pagination";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "内容管理", robots: { index: false, follow: false } };

const kindLabels: Record<string, string> = { ARTICLE: "文章", CASE: "案例", PAGE: "页面" };

export default async function ContentListPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    kind?: string;
    status?: string;
    deleted?: string;
    saved?: string;
    page?: string;
  }>;
}) {
  const query = await searchParams;
  const q = query.q?.trim().slice(0, 60) ?? "";
  const kind = ["ARTICLE", "CASE", "PAGE"].includes(query.kind ?? "") ? query.kind : undefined;
  const status = ["DRAFT", "PUBLISHED"].includes(query.status ?? "") ? query.status : undefined;
  const where = {
    kind,
    status,
    ...(q ? { OR: [{ title: { contains: q } }, { slug: { contains: q } }] } : {}),
  };
  const pageSize = 20;
  const [total, filteredCount] = await Promise.all([
    db.content.count(),
    db.content.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize));
  const requestedPage = Number.parseInt(query.page ?? "1", 10);
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1),
  );
  const items = await db.content.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      kind: true,
      slug: true,
      title: true,
      status: true,
      updatedAt: true,
    },
  });
  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (kind) params.set("kind", kind);
    if (status) params.set("status", status);
    params.set("page", String(page));
    return `/admin/content?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#a15d39]">CONTENT</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#18352e]">内容管理</h1>
          <p className="mt-2 text-sm text-[#5c6963]">
            共 {total} 条内容，筛选结果 {filteredCount} 条；第 {currentPage} / {totalPages} 页。
          </p>
        </div>
        <Link
          href="/admin/content/new"
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-[#174c3e] px-4 text-sm font-medium text-white"
        >
          <FilePlus2 className="size-4" aria-hidden="true" />
          新建内容
        </Link>
      </div>
      <div aria-live="polite">
        {query.deleted ? (
          <p className="mt-5 rounded-lg bg-[#e8f2e9] p-3 text-sm text-[#245c3c]">内容已删除。</p>
        ) : null}
        {query.saved ? (
          <p className="mt-5 rounded-lg bg-[#e8f2e9] p-3 text-sm text-[#245c3c]">草稿已保存。</p>
        ) : null}
      </div>
      <search className="mt-7 rounded-xl border border-[#dce1dc] bg-white p-4">
        <form
          action="/admin/content"
          method="get"
          aria-labelledby="content-filter-title"
          className="grid gap-4 sm:grid-cols-[1fr_150px_150px_auto] sm:items-end"
        >
          <h2 id="content-filter-title" className="sr-only">
            筛选内容
          </h2>
          <div>
            <label htmlFor="content-q" className="mb-2 block text-xs font-medium text-[#53625d]">
              搜索标题或别名
            </label>
            <input
              id="content-q"
              type="search"
              name="q"
              defaultValue={q}
              maxLength={60}
              className="min-h-11 w-full rounded-lg border border-[#bdc8c2] px-3 text-base"
            />
          </div>
          <div>
            <label htmlFor="content-kind" className="mb-2 block text-xs font-medium text-[#53625d]">
              内容类型
            </label>
            <select
              id="content-kind"
              name="kind"
              defaultValue={kind ?? ""}
              className="min-h-11 w-full rounded-lg border border-[#bdc8c2] bg-white px-3 text-base"
            >
              <option value="">全部类型</option>
              <option value="ARTICLE">文章</option>
              <option value="CASE">案例</option>
              <option value="PAGE">页面</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="content-status"
              className="mb-2 block text-xs font-medium text-[#53625d]"
            >
              发布状态
            </label>
            <select
              id="content-status"
              name="status"
              defaultValue={status ?? ""}
              className="min-h-11 w-full rounded-lg border border-[#bdc8c2] bg-white px-3 text-base"
            >
              <option value="">全部状态</option>
              <option value="PUBLISHED">已发布</option>
              <option value="DRAFT">草稿</option>
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#283f37] px-4 text-sm text-white"
          >
            <Search className="size-4" aria-hidden="true" />
            筛选
          </button>
        </form>
      </search>
      <div
        className="table-wrapper mt-6 rounded-xl border border-[#dce1dc] bg-white"
        tabIndex={0}
        role="region"
        aria-labelledby="content-table-caption"
      >
        <table className="admin-table w-full text-left text-sm">
          <caption
            id="content-table-caption"
            className="px-5 py-4 text-left font-semibold text-[#18352e]"
          >
            内容列表（{items.length} 条）
          </caption>
          <thead className="bg-[#f4f6f3] text-xs text-[#64716c]">
            <tr>
              <th scope="col" className="px-5 py-3">
                内容
              </th>
              <th scope="col" className="px-4 py-3">
                类型
              </th>
              <th scope="col" className="px-4 py-3">
                状态
              </th>
              <th scope="col" className="px-4 py-3">
                更新时间
              </th>
              <th scope="col" className="px-5 py-3">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e4e8e3]">
            {items.map((item) => (
              <tr key={item.id}>
                <th scope="row" className="max-w-xs bg-white px-5 py-4">
                  <p className="truncate font-medium text-[#18352e]">{item.title}</p>
                  <p className="mt-1 truncate font-mono text-xs font-normal text-[#64716c]">
                    {item.slug}
                  </p>
                </th>
                <td className="px-4 py-4 text-[#53625d]">{kindLabels[item.kind]}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${item.status === "PUBLISHED" ? "bg-[#e5f1e7] text-[#2c6643]" : "bg-[#f1eee3] text-[#806631]"}`}
                  >
                    {item.status === "PUBLISHED" ? "已发布" : "草稿"}
                  </span>
                </td>
                <td className="px-4 py-4 text-xs whitespace-nowrap text-[#64716c]">
                  {formatDate(item.updatedAt)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/content/${item.id}`}
                      className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-xs font-medium text-[#174c3e] hover:bg-[#edf2ed]"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      编辑
                    </Link>
                    {item.status === "PUBLISHED" ? (
                      <Link
                        href={getContentPath(item)}
                        target="_blank"
                        className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-xs text-[#53625d] hover:bg-[#edf2ed]"
                      >
                        查看
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 ? (
          <p className="border-t border-[#e4e8e3] px-5 py-12 text-center text-sm text-[#5c6963]">
            没有符合条件的内容。
          </p>
        ) : null}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageHref={pageHref}
        label="内容列表分页"
      />
    </div>
  );
}
