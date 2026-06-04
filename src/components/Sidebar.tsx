"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, Category, CATEGORY_ICONS } from "@/types";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth < 768;
    return true;
  });
  const [activeSection, setActiveSection] = useState<string>("home");

  // 同步折叠状态到 body class，控制主内容边距
  useEffect(() => {
    document.body.classList.toggle("sidebar-is-collapsed", collapsed);
    return () => document.body.classList.remove("sidebar-is-collapsed");
  }, [collapsed]);

  // 只在首页使用 IntersectionObserver 追踪滚动位置
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = document.querySelectorAll("[data-section]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } = { id: "home", ratio: 0 };
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-section") || "";
          if (entry.intersectionRatio > best.ratio) {
            best = { id, ratio: entry.intersectionRatio };
          }
        });
        if (best.ratio > 0) {
          setActiveSection(best.id);
        }
      },
      { threshold: [0.3, 0.6, 0.9] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // 非首页时用 pathname 判断
  const isActive = (id: string) => {
    if (pathname !== "/") {
      if (id === "home") return pathname === "/";
      if (id === "recommended") return false;
      return pathname === `/${id}`;
    }
    return activeSection === id;
  };

  const scrollTo = (sectionId: string) => {
    if (pathname !== "/") {
      window.location.href = "/";
      return;
    }
    const el = document.querySelector(`[data-section="${sectionId}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const renderIcon = (name: string) => (
    <span
      className="flex items-center justify-center shrink-0 w-5 h-5"
      dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[name] || "" }}
    />
  );

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setCollapsed(false)}
        className="fixed top-3 left-3 z-40 md:hidden p-2 rounded-lg bg-white shadow-md border border-[var(--color-border)]"
        aria-label="打开菜单"
      >
        <svg className="w-5 h-5 text-[var(--color-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen z-30 bg-[var(--color-sidebar-bg)] border-r border-[var(--color-border)] flex flex-col overflow-hidden sidebar-aside ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}
      >
        {/* Header */}
        <div className={`flex items-center border-b border-[var(--color-border)] min-h-0 ${collapsed ? "justify-center px-1.5 py-3" : "justify-between px-3 py-3"}`}>
          {!collapsed ? (
            <button onClick={() => scrollTo("home")} className="flex items-center gap-1.5 ml-1 cursor-pointer">
              <span className="text-lg font-bold text-[var(--color-ocean-600)]">木子</span>
              <span className="text-base font-medium text-[var(--color-text)]">新闻</span>
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-ocean-50)] hover:text-[var(--color-ocean-600)] transition-all cursor-pointer"
              title="展开侧栏"
              aria-label="展开侧栏"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-ocean-50)] hover:text-[var(--color-ocean-600)] transition-all cursor-pointer"
              title="折叠侧栏"
              aria-label="折叠侧栏"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 space-y-0.5 px-1.5 overflow-y-auto">
          <button
            onClick={() => scrollTo("home")}
            className={`w-full flex items-center justify-center gap-3 px-2 py-2 rounded-lg transition-all ${
              isActive("home")
                ? "bg-[var(--color-ocean-100)] text-[var(--color-ocean-700)] font-medium"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-ocean-50)] hover:text-[var(--color-ocean-600)]"
            }`}
            title="首页"
          >
            {renderIcon("home")}
            {!collapsed && <span className="text-sm">首页</span>}
          </button>

          <button
            onClick={() => scrollTo("recommended")}
            className={`w-full flex items-center justify-center gap-3 px-2 py-2 rounded-lg transition-all ${
              isActive("recommended")
                ? "bg-[var(--color-ocean-100)] text-[var(--color-ocean-700)] font-medium"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-ocean-50)] hover:text-[var(--color-ocean-600)]"
            }`}
            title="推荐"
          >
            {renderIcon("recommended")}
            {!collapsed && (
              <span className="flex items-center gap-2 text-sm">
                推荐
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-50 text-red-500">热门</span>
              </span>
            )}
          </button>

          <div className="my-1.5 border-t border-[var(--color-border)]" />

          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/${cat.key}`}
              className={`flex items-center justify-center gap-3 px-2 py-2 rounded-lg transition-all ${
                isActive(cat.key)
                  ? "bg-[var(--color-ocean-100)] text-[var(--color-ocean-700)] font-medium"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-ocean-50)] hover:text-[var(--color-ocean-600)]"
              }`}
              title={cat.label}
            >
              {renderIcon(cat.key)}
              {!collapsed && <span className="text-sm">{cat.label}</span>}
            </Link>
          ))}

          <div className="my-1.5 border-t border-[var(--color-border)]" />

          <Link
            href="/search"
            className={`flex items-center justify-center gap-3 px-2 py-2 rounded-lg transition-all ${
              pathname === "/search"
                ? "bg-[var(--color-ocean-100)] text-[var(--color-ocean-700)] font-medium"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-ocean-50)] hover:text-[var(--color-ocean-600)]"
            }`}
            title="搜索"
          >
            {renderIcon("search")}
            {!collapsed && <span className="text-sm">搜索</span>}
          </Link>
        </nav>

        {!collapsed && (
          <div className="p-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)] text-center">
            RSS 订阅
          </div>
        )}
      </aside>
    </>
  );
}
