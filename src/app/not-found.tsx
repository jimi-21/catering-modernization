import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#f4f3ee] px-5 py-20">
      <div className="max-w-xl text-center">
        <p className="font-mono text-sm tracking-[0.2em] text-[#a15d39]">404 / NOT FOUND</p>
        <h1 className="mt-6 font-serif text-4xl font-semibold text-[#173c32]">
          这页内容不存在或已移动
        </h1>
        <p className="mt-5 text-base leading-8 text-[#64716c]">
          如果是老站链接，请检查迁移映射；也可以返回首页继续浏览。
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#173c32] px-6 text-sm text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          返回首页
        </Link>
      </div>
    </main>
  );
}
