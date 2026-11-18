"use client";

import { RefreshCw } from "lucide-react";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-[#dce1dc] bg-white p-8 text-center">
      <h1 className="text-2xl font-semibold text-[#18352e]">后台页面暂时无法加载</h1>
      <p className="mt-4 text-sm leading-7 text-[#64716c]">
        若刚刚提交过内容，请先到列表确认保存结果，避免重复操作。若问题持续，请检查数据库和部署日志。
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#174c3e] px-5 text-sm font-medium text-white"
      >
        <RefreshCw className="size-4" aria-hidden="true" />
        重试
      </button>
    </div>
  );
}
