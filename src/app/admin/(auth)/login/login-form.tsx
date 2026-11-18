"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#174c3e] px-5 font-medium text-white transition hover:bg-[#103b30] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "正在登录…" : "登录后台"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(authenticate, {});

  return (
    <form
      action={formAction}
      method="post"
      className="mt-9 space-y-5"
      aria-labelledby="login-title"
    >
      <h2 id="login-title" className="sr-only">
        管理员登录
      </h2>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#344a43]">
          邮箱
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          defaultValue="admin@hengshan.demo"
          className="min-h-12 w-full rounded-xl border border-[#bdc8c2] bg-white px-4 text-base outline-none focus:border-[#174c3e] focus:ring-3 focus:ring-[#174c3e]/15"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#344a43]">
          密码
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="min-h-12 w-full rounded-xl border border-[#bdc8c2] bg-white px-4 text-base outline-none focus:border-[#174c3e] focus:ring-3 focus:ring-[#174c3e]/15"
        />
      </div>
      <div aria-live="polite">
        {state.error ? <p className="text-sm font-medium text-[#a43d32]">{state.error}</p> : null}
      </div>
      <SubmitButton />
    </form>
  );
}
