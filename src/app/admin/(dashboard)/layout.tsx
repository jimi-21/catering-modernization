import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin-nav";
import { Brand } from "@/components/brand";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "@/app/admin/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-dvh bg-[#f4f5f2] lg:grid lg:grid-cols-[240px_1fr]">
      <a href="#admin-content" className="skip-link">
        跳到后台内容
      </a>
      <aside className="bg-[#14382f] px-5 py-5 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-60 lg:flex-col lg:px-4">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Brand light />
          <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] text-white/70 lg:mt-3 lg:ml-3 lg:inline-block">
            DEMO CMS
          </span>
        </div>
        <AdminNav />
        <div className="hidden lg:mt-auto lg:block lg:border-t lg:border-white/10 lg:pt-4">
          <p className="truncate px-3 text-xs text-white/65">{session.name}</p>
          <Link
            href="/"
            target="_blank"
            className="mt-3 flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-white/60 hover:text-white"
          >
            查看官网 <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-white/60 hover:text-white"
            >
              <LogOut className="size-4" aria-hidden="true" />
              退出登录
            </button>
          </form>
        </div>
      </aside>
      <main id="admin-content" tabIndex={-1} className="min-w-0 lg:col-start-2">
        <header className="flex items-center justify-between border-b border-[#dce1dc] bg-white px-5 py-4 sm:px-8 lg:px-10">
          <p className="text-sm text-[#64716c]">你好，{session.name}</p>
          <form action={signOut} className="lg:hidden">
            <button
              type="submit"
              className="inline-flex min-h-10 items-center gap-2 text-sm text-[#53625d]"
            >
              <LogOut className="size-4" aria-hidden="true" />
              退出
            </button>
          </form>
        </header>
        <div className="p-5 sm:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
