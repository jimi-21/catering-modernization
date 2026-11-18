import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "内容管理登录",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");

  return (
    <main className="grid min-h-dvh bg-[#f4f3ee] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#123b32] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> 返回官网
        </Link>
        <div className="max-w-xl">
          <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-[#efb58e]">HENGSHAN CMS</p>
          <h1 className="font-serif text-5xl leading-tight">
            让好内容，
            <br />
            有序地抵达。
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-white/65">
            统一管理文章、案例与专题页面，独立配置搜索展示信息，让内容更新不再依赖开发者。
          </p>
        </div>
        <p className="text-xs text-white/65">独立演示项目 · 非真实企业管理系统</p>
      </section>
      <section className="flex items-center justify-center px-5 py-16 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-[#53625d] lg:hidden"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> 返回官网
          </Link>
          <div className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-[#dfe9df] text-[#174c3e]">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#18352e]">欢迎回来</h2>
          <p className="mt-3 text-sm leading-6 text-[#5c6963]">登录衡膳内容管理后台</p>
          <LoginForm />
          <div className="mt-8 rounded-xl border border-[#d9ded8] bg-white/60 p-4 text-xs leading-6 text-[#5c6963]">
            <p className="font-semibold text-[#344a43]">本地演示账号</p>
            <p>邮箱：admin@hengshan.demo</p>
            <p>密码：Demo!2026</p>
          </div>
        </div>
      </section>
    </main>
  );
}
