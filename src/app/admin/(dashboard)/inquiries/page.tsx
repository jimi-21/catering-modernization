import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { Pagination } from "@/components/pagination";
import { updateInquiryStatus } from "./actions";
import { DeleteInquiryButton } from "./delete-button";

export const metadata: Metadata = { title: "咨询线索", robots: { index: false, follow: false } };

const statusLabels: Record<string, string> = {
  NEW: "新咨询",
  CONTACTED: "已跟进",
  CLOSED: "已关闭",
};

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  const pageSize = 25;
  const total = await db.inquiry.count();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const requestedPage = Number.parseInt(query.page ?? "1", 10);
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1),
  );
  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  const pageHref = (page: number) => `/admin/inquiries?page=${page}`;
  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#a15d39]">INQUIRIES</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#18352e]">咨询线索</h1>
        <p className="mt-2 text-sm text-[#5c6963]">
          共 {total} 条咨询，第 {currentPage} / {totalPages} 页。
        </p>
      </div>
      <div className="mt-8 space-y-4">
        {inquiries.map((inquiry) => (
          <article
            key={inquiry.id}
            className="rounded-xl border border-[#dce1dc] bg-white p-5 sm:p-6"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-[#18352e]">{inquiry.name}</h2>
                  <span className="rounded-full bg-[#edf1eb] px-2.5 py-1 text-xs text-[#53625d]">
                    {inquiry.need}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#64716c]">
                  {inquiry.company || "未填写单位"} · {inquiry.phone}
                </p>
              </div>
              <time className="text-xs text-[#64716c]" dateTime={inquiry.createdAt.toISOString()}>
                {formatDateTime(inquiry.createdAt)}
              </time>
            </div>
            {inquiry.message ? (
              <p className="mt-5 rounded-lg bg-[#f6f7f4] p-4 text-sm leading-7 whitespace-pre-wrap text-[#53625d]">
                {inquiry.message}
              </p>
            ) : null}
            <form
              key={`${inquiry.id}-${inquiry.status}`}
              action={updateInquiryStatus}
              className="mt-5 flex flex-wrap items-end gap-3 border-t border-[#e4e8e3] pt-4"
            >
              <input type="hidden" name="id" value={inquiry.id} />
              <div>
                <label
                  htmlFor={`status-${inquiry.id}`}
                  className="mb-2 block text-xs font-medium text-[#53625d]"
                >
                  处理状态
                </label>
                <select
                  id={`status-${inquiry.id}`}
                  name="status"
                  defaultValue={inquiry.status}
                  className="min-h-10 rounded-lg border border-[#bdc8c2] bg-white px-3 text-base"
                >
                  <option value="NEW">{statusLabels.NEW}</option>
                  <option value="CONTACTED">{statusLabels.CONTACTED}</option>
                  <option value="CLOSED">{statusLabels.CLOSED}</option>
                </select>
              </div>
              <button
                type="submit"
                className="min-h-10 rounded-lg bg-[#283f37] px-4 text-sm text-white"
              >
                更新状态
              </button>
            </form>
            <div className="mt-3 flex justify-end">
              <DeleteInquiryButton id={inquiry.id} name={inquiry.name} />
            </div>
          </article>
        ))}
        {inquiries.length === 0 ? (
          <p className="rounded-xl border border-[#dce1dc] bg-white px-5 py-16 text-center text-sm text-[#5c6963]">
            暂无咨询。可以从官网联系页面提交一条进行验证。
          </p>
        ) : null}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageHref={pageHref}
        label="咨询列表分页"
      />
    </div>
  );
}
