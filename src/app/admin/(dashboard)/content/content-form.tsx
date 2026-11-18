"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Save } from "lucide-react";
import type { Content } from "@prisma/client";
import { getContentPath } from "@/lib/content";
import { saveContent } from "./actions";
import { DeleteButton } from "./delete-button";

function SaveButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#174c3e] px-5 text-sm font-medium text-white hover:bg-[#103b30] disabled:cursor-wait disabled:opacity-60"
    >
      <Save className="size-4" aria-hidden="true" />
      {pending ? "正在保存…" : "保存内容"}
    </button>
  );
}

export function ContentForm({ content }: { content?: Content }) {
  const [state, formAction, pending] = useActionState(saveContent, {});
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }
  const inputClass =
    "min-h-11 w-full rounded-lg border border-[#bdc8c2] bg-white px-3.5 text-base text-[#18352e] outline-none placeholder:text-[#929d97] focus:border-[#174c3e] focus:ring-3 focus:ring-[#174c3e]/15";
  const labelClass = "mb-2 block text-sm font-medium text-[#344a43]";

  return (
    <>
      <form
        action={formAction}
        onSubmit={handleSubmit}
        method="post"
        aria-labelledby="editor-title"
        className="grid gap-6 lg:grid-cols-[1fr_300px]"
      >
        <input type="hidden" name="id" value={content?.id ?? ""} />
        <input type="hidden" name="coverImage" value={content?.coverImage ?? ""} />
        <div className="space-y-6">
          <section className="rounded-xl border border-[#dce1dc] bg-white p-5 sm:p-6">
            <h2 className="mb-6 font-semibold text-[#18352e]">基本信息</h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="title" className={labelClass}>
                  标题 <span aria-hidden="true">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  minLength={2}
                  maxLength={100}
                  defaultValue={content?.title}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="slug" className={labelClass}>
                  URL 别名 <span aria-hidden="true">*</span>
                </label>
                <input
                  id="slug"
                  name="slug"
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  maxLength={100}
                  defaultValue={content?.slug}
                  readOnly={Boolean(content)}
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-describedby="slug-hint"
                  className={inputClass}
                />
                <p id="slug-hint" className="mt-2 text-xs leading-5 text-[#64716c]">
                  {content
                    ? "URL 别名创建后不可修改，避免已有收录和外部链接失效。"
                    : "小写字母、数字与连字符，例如 food-safety-guide。创建后不可修改。"}
                </p>
              </div>
              <div>
                <label htmlFor="excerpt" className={labelClass}>
                  摘要 <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  required
                  minLength={10}
                  maxLength={240}
                  rows={3}
                  defaultValue={content?.excerpt}
                  className={`${inputClass} resize-y py-3`}
                />
              </div>
              <div>
                <label htmlFor="body" className={labelClass}>
                  正文（Markdown） <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="body"
                  name="body"
                  required
                  minLength={20}
                  maxLength={50000}
                  rows={18}
                  defaultValue={content?.body}
                  aria-describedby="body-hint"
                  className={`${inputClass} resize-y py-3 font-mono text-sm leading-7`}
                />
                <p id="body-hint" className="mt-2 text-xs text-[#64716c]">
                  支持标题、列表、引用与表格；不执行原始 HTML。
                </p>
              </div>
            </div>
          </section>
          <fieldset className="rounded-xl border border-[#dce1dc] bg-white p-5 sm:p-6">
            <legend className="px-2 font-semibold text-[#18352e]">搜索与分享</legend>
            <div className="space-y-5">
              <div>
                <label htmlFor="seoTitle" className={labelClass}>
                  SEO 标题
                </label>
                <input
                  id="seoTitle"
                  name="seoTitle"
                  maxLength={100}
                  defaultValue={content?.seoTitle ?? ""}
                  aria-describedby="seo-title-hint"
                  className={inputClass}
                />
                <p id="seo-title-hint" className="mt-2 text-xs text-[#64716c]">
                  留空则使用内容标题，建议前置本页主题，避免关键词堆砌。
                </p>
              </div>
              <div>
                <label htmlFor="seoDescription" className={labelClass}>
                  SEO 描述
                </label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  maxLength={200}
                  rows={3}
                  defaultValue={content?.seoDescription ?? ""}
                  className={`${inputClass} resize-y py-3`}
                />
              </div>
            </div>
          </fieldset>
        </div>
        <div className="space-y-6">
          <section className="rounded-xl border border-[#dce1dc] bg-white p-5">
            <h2 className="mb-5 font-semibold text-[#18352e]">发布设置</h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="kind" className={labelClass}>
                  内容类型
                </label>
                <select
                  id="kind"
                  name={content ? undefined : "kind"}
                  defaultValue={content?.kind ?? "ARTICLE"}
                  disabled={Boolean(content)}
                  className={inputClass}
                >
                  <option value="ARTICLE">文章</option>
                  <option value="CASE">案例</option>
                  <option value="PAGE">自定义页面</option>
                </select>
                {content ? <input type="hidden" name="kind" value={content.kind} /> : null}
              </div>
              <div>
                <label htmlFor="category" className={labelClass}>
                  栏目 <span aria-hidden="true">*</span>
                </label>
                <input
                  id="category"
                  name="category"
                  required
                  minLength={2}
                  maxLength={40}
                  defaultValue={content?.category ?? "运营方法"}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="template" className={labelClass}>
                  页面模板
                </label>
                <select
                  id="template"
                  name="template"
                  defaultValue={content?.template ?? "STANDARD"}
                  className={inputClass}
                >
                  <option value="STANDARD">标准内容模板</option>
                  <option value="FEATURE">专题横幅模板</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className={labelClass}>
                  发布状态
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={content?.status ?? "DRAFT"}
                  className={inputClass}
                >
                  <option value="DRAFT">保存为草稿</option>
                  <option value="PUBLISHED">正式发布</option>
                </select>
              </div>
            </div>
          </section>
          <section className="rounded-xl border border-[#dce1dc] bg-white p-5">
            <h2 className="mb-5 font-semibold text-[#18352e]">封面图片</h2>
            {content?.coverImage ? (
              <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-[#edf0ec]">
                <Image
                  src={content.coverImage}
                  alt={content.coverAlt ?? ""}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              </div>
            ) : null}
            <label htmlFor="coverUpload" className={labelClass}>
              上传新封面
            </label>
            <input
              id="coverUpload"
              name="coverUpload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-describedby="cover-hint"
              className="w-full text-xs text-[#64716c] file:mr-3 file:min-h-10 file:rounded-lg file:border-0 file:bg-[#e9efea] file:px-3 file:text-[#173c32]"
            />
            <p id="cover-hint" className="mt-2 text-xs leading-5 text-[#64716c]">
              JPG、PNG 或 WebP，最大 3 MB。服务端会检查文件签名。
            </p>
            <div className="mt-5">
              <label htmlFor="coverAlt" className={labelClass}>
                图片替代文本
              </label>
              <input
                id="coverAlt"
                name="coverAlt"
                maxLength={160}
                defaultValue={content?.coverAlt ?? ""}
                className={inputClass}
              />
            </div>
            {content?.coverImage ? (
              <div className="mt-4 flex items-center gap-2">
                <input
                  id="removeCover"
                  name="removeCover"
                  type="checkbox"
                  className="size-4 accent-[#174c3e]"
                />
                <label htmlFor="removeCover" className="text-sm text-[#64716c]">
                  移除现有封面
                </label>
              </div>
            ) : null}
          </section>
          <div aria-live="polite">
            {state.error ? (
              <p className="rounded-lg bg-[#fff0eb] p-4 text-sm font-medium text-[#9d3f30]">
                {state.error}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            <SaveButton pending={pending} />
            {content?.status === "PUBLISHED" ? (
              <Link
                href={getContentPath(content)}
                target="_blank"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#cbd4ce] bg-white px-4 text-sm text-[#344a43]"
              >
                打开前台页面 <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </form>
      {content ? (
        <div className="mt-8 border-t border-[#dce1dc] pt-6">
          <DeleteButton id={content.id} title={content.title} />
        </div>
      ) : null}
    </>
  );
}
