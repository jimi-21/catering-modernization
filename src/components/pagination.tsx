import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  pageHref,
  label,
}: {
  currentPage: number;
  totalPages: number;
  pageHref: (page: number) => string;
  label: string;
}) {
  if (totalPages <= 1) return null;
  const linkClass =
    "inline-flex min-h-11 items-center rounded-lg border border-[#cbd4ce] bg-white px-4 text-sm text-[#344a43]";
  return (
    <nav aria-label={label} className="mt-6 flex items-center justify-between gap-4">
      {currentPage > 1 ? (
        <Link href={pageHref(currentPage - 1)} className={linkClass}>
          上一页
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-[#64716c]">
        第 {currentPage} 页，共 {totalPages} 页
      </span>
      {currentPage < totalPages ? (
        <Link href={pageHref(currentPage + 1)} className={linkClass}>
          下一页
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
