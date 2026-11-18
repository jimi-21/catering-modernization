import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContentForm } from "../content-form";

export const metadata: Metadata = { title: "新建内容", robots: { index: false, follow: false } };

export default function NewContentPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/content"
        className="inline-flex min-h-10 items-center gap-2 text-sm text-[#64716c]"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        返回内容列表
      </Link>
      <h1
        id="editor-title"
        className="mt-3 mb-7 text-3xl font-semibold tracking-tight text-[#18352e]"
      >
        新建内容
      </h1>
      <ContentForm />
    </div>
  );
}
