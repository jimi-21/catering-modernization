"use client";

import { RefreshCw } from "lucide-react";

export default function SiteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto grid min-h-[60dvh] max-w-3xl place-items-center px-5 py-20 text-center">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-[#a15d39]">TEMPORARY ERROR</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-[#173c32]">页面暂时无法加载</h1>
        <p className="mt-5 text-base leading-8 text-[#64716c]">
          内容服务可能出现短暂异常。请重试，或稍后返回首页继续浏览。
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#173c32] px-6 text-sm font-medium text-white"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          重新加载
        </button>
      </div>
    </div>
  );
}
