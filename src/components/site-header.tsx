"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { navigation } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!Object.hasOwn(HTMLElement.prototype, "popover")) {
      void import("@oddbird/popover-polyfill");
    }

    const header = headerRef.current;
    const inner = innerRef.current;
    const menu = menuRef.current;
    if (!header || !inner || !menu) return;

    let frame = 0;
    const menuIsOpen = () => menu.matches(":popover-open, .\\:popover-open");
    const syncLayout = () => {
      if (menuIsOpen() && !header.classList.contains("is-wide")) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (menuIsOpen() && !header.classList.contains("is-wide")) return;
        header.classList.add("is-measuring", "is-wide");
        const fits = inner.scrollWidth <= inner.clientWidth;
        header.classList.toggle("is-wide", fits);
        if (fits) {
          menu.removeAttribute("popover");
        } else {
          menu.setAttribute("popover", "auto");
        }
        requestAnimationFrame(() => header.classList.remove("is-measuring"));
      });
    };
    const handleToggle = (event: Event) => {
      if ((event as Event & { newState?: string }).newState === "closed") syncLayout();
    };

    let previousWidth = inner.clientWidth;
    const observer = new ResizeObserver(() => {
      const collapsed = !header.classList.contains("is-wide");
      const width = inner.clientWidth;
      if (collapsed && width <= previousWidth) return;
      previousWidth = width;
      syncLayout();
    });
    observer.observe(inner);
    menu.addEventListener("toggle", handleToggle);
    void document.fonts.ready.then(syncLayout);
    syncLayout();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      menu.removeEventListener("toggle", handleToggle);
    };
  }, []);

  return (
    <header ref={headerRef} className="site-header">
      <div
        ref={innerRef}
        className="header-inner mx-auto flex max-w-[1440px] items-center gap-8 px-5 py-4 sm:px-8 lg:px-12"
      >
        <Brand />
        <nav className="site-nav ml-auto flex items-center gap-6" aria-label="主导航">
          <button
            className="menu-button grid size-11 place-items-center rounded-full border border-[#d4dbd6] text-[#173c32]"
            type="button"
            popoverTarget="site-menu"
            popoverTargetAction="toggle"
            aria-controls="site-menu"
          >
            <Menu className="menu-open size-5" aria-hidden="true" />
            <X className="menu-close hidden size-5" aria-hidden="true" />
            <span className="sr-only">打开导航菜单</span>
          </button>
          <ul id="site-menu" ref={menuRef} className="site-menu" popover="auto">
            {navigation.map((item) => {
              const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={(event) => {
                      const list = event.currentTarget.closest("ul");
                      if (list?.hasAttribute("popover")) list.hidePopover?.();
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="mobile-contact">
              <Link
                href="/contact"
                aria-current={pathname === "/contact" ? "page" : undefined}
                onClick={(event) => event.currentTarget.closest("ul")?.hidePopover?.()}
              >
                获取供餐方案 <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className="header-cta hidden items-center gap-2 rounded-full bg-[#174c3e] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0e382d]"
          >
            获取供餐方案 <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
