"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, Category } from "@/types";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  const isActive = (cat: Category | "home") => {
    if (cat === "home") return pathname === "/";
    return pathname === `/${cat}`;
  };

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
        aria-label="Open menu"
      >
        <svg className="w-5 h-5 text-[var(--color-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-30 bg-[var(--color-sidebar-bg)] border-r border-[var(--color-border)] flex flex-col transition-all duration-300 ${
          collapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "translate-x-0 w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          {!collapsed ? (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-[var(--color-ocean-600)]">木子</span>
              <span className="text-lg font-medium text-[var(--color-text)]">新闻</span>
            </Link>
          ) : (
            <Link href="/" className="mx-auto">
              <span className="text-xl font-bold text-[var(--color-ocean-600)]">木</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-[var(--color-ocean-100)] transition-colors text-[var(--color-text-secondary)] md:block hidden"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 space-y-1 px-2 overflow-y-auto">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive("home")
                ? "bg-[var(--color-ocean-100)] text-[var(--color-ocean-700)] font-medium"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-ocean-50)] hover:text-[var(--color-ocean-600)]"
            }`}
            title="Home"
          >
            <span className="text-lg">🏠</span>
            {!collapsed && <span>首页</span>}
          </Link>

          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/${cat.key}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive(cat.key)
                  ? "bg-[var(--color-ocean-100)] text-[var(--color-ocean-700)] font-medium"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-ocean-50)] hover:text-[var(--color-ocean-600)]"
              }`}
              title={cat.label}
            >
              <span className="text-lg">{cat.icon}</span>
              {!collapsed && <span>{cat.label}</span>}
            </Link>
          ))}

          <div className="my-2 border-t border-[var(--color-border)]" />

          <Link
            href="/search"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              pathname === "/search"
                ? "bg-[var(--color-ocean-100)] text-[var(--color-ocean-700)] font-medium"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-ocean-50)] hover:text-[var(--color-ocean-600)]"
            }`}
            title="Search"
          >
            <span className="text-lg">🔍</span>
            {!collapsed && <span>搜索</span>}
          </Link>
        </nav>

        {!collapsed && (
          <div className="p-3 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)] text-center">
            RSS Feed Available
          </div>
        )}
      </aside>
    </>
  );
}
