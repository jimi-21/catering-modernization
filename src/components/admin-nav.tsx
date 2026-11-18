"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, MessageSquareText } from "lucide-react";

const links = [
  { href: "/admin", label: "概览", icon: LayoutDashboard },
  { href: "/admin/content", label: "内容管理", icon: FileText },
  { href: "/admin/inquiries", label: "咨询线索", icon: MessageSquareText },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="后台导航"
      className="admin-nav flex gap-1 overflow-x-auto lg:mt-8 lg:block lg:space-y-1 lg:overflow-visible"
    >
      {links.map((item) => {
        const Icon = item.icon;
        const current =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className="flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-sm text-white/60 transition hover:bg-white/8 hover:text-white aria-current:bg-white/10 aria-current:font-medium aria-current:text-white"
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
