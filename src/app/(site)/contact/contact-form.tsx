"use client";

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { INQUIRY_NEEDS } from "@/lib/inquiry-options";
import { submitInquiry } from "./actions";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-[#173c32] px-6 text-sm font-medium text-white transition hover:bg-[#0e382d] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
    >
      {pending ? "正在提交…" : "提交咨询需求"}
      <ArrowUpRight className="size-4" aria-hidden="true" />
    </button>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, {});
  const formRef = useRef<HTMLFormElement>(null);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  const inputClass =
    "min-h-12 w-full rounded-xl border border-[#bdc8c2] bg-white px-4 text-base text-[#173c32] outline-none placeholder:text-[#929d97] focus:border-[#174c3e] focus:ring-3 focus:ring-[#174c3e]/15";
  const labelClass = "mb-2 block text-sm font-medium text-[#344a43]";

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      method="post"
      aria-labelledby="contact-form-title"
      className="space-y-5"
    >
      <h2 id="contact-form-title" className="mb-7 font-serif text-2xl font-semibold text-[#173c32]">
        告诉我们你的基本情况
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            联系人 <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            required
            minLength={2}
            maxLength={50}
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-company" className={labelClass}>
            单位名称
          </label>
          <input
            id="contact-company"
            name="company"
            maxLength={100}
            autoComplete="organization"
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            联系电话 <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            pattern="[0-9+\-\s]{7,20}"
            autoComplete="tel"
            inputMode="tel"
            aria-describedby="phone-hint"
            className={inputClass}
          />
          <p id="phone-hint" className="mt-2 text-xs text-[#64716c]">
            仅用于本次业务沟通
          </p>
        </div>
        <div>
          <label htmlFor="contact-need" className={labelClass}>
            咨询方向 <span aria-hidden="true">*</span>
          </label>
          <select id="contact-need" name="need" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              请选择
            </option>
            {INQUIRY_NEEDS.map((need) => (
              <option key={need} value={need}>
                {need}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          补充说明
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          maxLength={1000}
          placeholder="例如：就餐人数、餐次、现有场地和期望启动时间"
          className={`${inputClass} resize-y py-3`}
        />
      </div>
      <div className="absolute -left-[10000px] size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">网站</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div aria-live="polite">
        {state.error ? (
          <p className="rounded-xl bg-[#fff0eb] p-4 text-sm font-medium text-[#9d3f30]">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="flex items-start gap-3 rounded-xl bg-[#e8f2e9] p-4 text-sm leading-6 font-medium text-[#245c3c]">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            需求已提交。你可以在后台“咨询线索”中查看这条真实入库记录。
          </p>
        ) : null}
      </div>
      <SubmitButton pending={pending} />
      <p className="text-xs leading-5 text-[#64716c]">
        演示项目不会拨打电话或发送邮件；提交内容仅写入本地演示数据库。请勿填写真实敏感信息。
      </p>
    </form>
  );
}
