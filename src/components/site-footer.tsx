import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { navigation, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#102f28] text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 border-b border-white/12 pb-14 md:grid-cols-[1.4fr_1fr_1fr] lg:gap-20">
          <div>
            <Brand light />
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
              以专业运营、透明流程和持续改进，为企事业单位提供更安心的一日三餐。
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 border-b border-[#d9a477] pb-1 text-sm text-[#f0c39f]"
            >
              聊聊你的供餐需求 <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/90">快速导航</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/55">
              {navigation.slice(1).map((item) => (
                <li key={item.href}>
                  <Link className="transition hover:text-white" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/90">业务联系</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-white/55">
              <li>{site.phone}</li>
              <li>{site.email}</li>
              <li>{site.serviceArea}</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-7 text-xs leading-5 text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 衡膳餐饮 · 本站为独立开发演示，所有品牌与业务信息均为虚构。</p>
          <Link href="/admin/login" className="w-fit transition hover:text-white/70">
            内容管理
          </Link>
        </div>
      </div>
    </footer>
  );
}
