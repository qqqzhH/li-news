"use client";

import Link from "next/link";
import { getAllNews, getHotNews, formatTime } from "@/lib/news";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES, CATEGORY_ICONS } from "@/types";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HomePage() {
  const data = getAllNews();
  const hotNews = getHotNews();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const updRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const catsRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Title cascade: clean fade-in, no y movement that feels jumpy
    tl.fromTo(titleRef.current, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(subtitleRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
      .fromTo(updRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.15")
      .fromTo(quoteRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.1")
      .fromTo(searchRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, "-=0.1")
      .fromTo(".cat-card", { opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.06 }, "-=0.15");

    // Floating arrow
    gsap.to(arrowRef.current, { y: -6, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // Section 2 decorative
    const s2 = section2Ref.current;
    if (s2) {
      const check = () => {
        const r = s2.getBoundingClientRect();
        if (r.top < window.innerHeight + 100) {
          gsap.fromTo(".s2-title-line", { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.out", transformOrigin: "left center" });
          gsap.fromTo(".s2-cols", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
          window.removeEventListener("scroll", check);
        }
      };
      check();
      window.addEventListener("scroll", check, { passive: true });
      return () => window.removeEventListener("scroll", check);
    }
  }, []);

  return (
    <div className="snap-container space-y-0">
      {/* ===== Screen 1 ===== */}
      <section data-section="home" className="snap-start min-h-screen flex flex-col justify-center px-5 md:px-10 max-w-3xl mx-auto w-full">
        {/* Title hierarchy */}
        <div className="text-center">
          <h1 ref={titleRef} className="text-6xl md:text-7xl font-black tracking-wide leading-none">
            <span className="text-[var(--color-ocean-600)]">木子</span>
            <span className="text-[var(--color-text)]">新闻</span>
          </h1>
          <p ref={subtitleRef} className="mt-3 text-sm md:text-base text-[var(--color-text-muted)] max-w-md mx-auto">
            AI 动态 · 机器人 · 地缘政治 · 金融市场
          </p>
          <div ref={updRef} className="mt-2 text-xs text-[var(--color-text-muted)]/60">
            <span>每日 9:00 自动更新</span>
            {data.lastUpdated && (
              <>
                <span className="mx-1.5 inline-block w-0.5 h-0.5 rounded-full bg-[var(--color-text-muted)]/40 align-middle" />
                <span>上次更新 {formatTime(data.lastUpdated)}</span>
              </>
            )}
          </div>
        </div>

        {/* Quote */}
        <div ref={quoteRef} className="mt-8 text-center">
          <p className="text-sm text-[var(--color-text-muted)]/70 italic font-serif leading-relaxed tracking-wide">
            <span className="text-[var(--color-ocean-400)] text-lg leading-none mr-1">&ldquo;</span>
            信息筛选的能力，比信息获取的能力更重要
            <span className="text-[var(--color-ocean-400)] text-lg leading-none ml-1">&rdquo;</span>
          </p>
        </div>

        {/* Search */}
        <div ref={searchRef} className="mt-10 max-w-md mx-auto w-full">
          <SearchBar large />
        </div>

        {/* Category cards */}
        <div ref={catsRef} className="mt-12 grid grid-cols-3 md:grid-cols-5 gap-4 max-w-xl mx-auto w-full">
          {CATEGORIES.map((cat) => {
            const count = data.items.filter((i) => i.category === cat.key).length;
            return (
              <Link key={cat.key} href={`/${cat.key}`}
                className="cat-card bg-white border border-[var(--color-border)] rounded-xl py-4 px-2 text-center hover:border-[var(--color-ocean-400)] hover:shadow-lg hover:-translate-y-1 transition-all duration-250"
              >
                <div className="flex justify-center mb-2 text-[var(--color-ocean-500)]">
                  <span dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[cat.key] || "" }} />
                </div>
                <div className="text-sm font-semibold text-[var(--color-text)]">{cat.label}</div>
                <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{count} 条</div>
              </Link>
            );
          })}
        </div>

        {/* Arrow guide */}
        <div ref={arrowRef} className="mt-12 flex flex-col items-center gap-1.5 text-[var(--color-text-muted)]/50 cursor-pointer">
          <span className="text-xs tracking-widest">探索</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ===== Screen 2: 今日精选 ===== */}
      <section data-section="recommended" className="snap-start min-h-screen flex flex-col justify-center px-5 md:px-10 max-w-5xl mx-auto w-full" ref={section2Ref}>
        <div className="w-full">
          {/* Section title */}
          <div className="s2-title-line h-px w-16 bg-[var(--color-ocean-300)] mb-5" />
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-1">今日精选</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">推荐阅读 · 最新动态</p>

          {/* Two columns */}
          <div className="s2-cols grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Left: Recommended */}
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                推荐阅读
              </h3>
              <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-xl overflow-hidden bg-white">
                {hotNews.slice(0, 5).length > 0 ? hotNews.slice(0, 5).map((item, idx) => (
                  <Link key={item.id} href={`/${item.category}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-ocean-50)] transition-colors"
                  >
                    <span className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold shrink-0 ${idx < 3 ? "bg-red-50 text-red-500" : "bg-gray-50 text-[var(--color-text-muted)]"}`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[var(--color-text)] truncate">{item.title}</div>
                      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatTime(item.publishedAt)}</div>
                    </div>
                  </Link>
                )) : (
                  <div className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">暂无推荐</div>
                )}
              </div>
            </div>

            {/* Right: Latest */}
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--color-ocean-500)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                最新动态
              </h3>
              <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-xl overflow-hidden bg-white">
                {data.items.slice(0, 5).length > 0 ? data.items.slice(0, 5).map((item) => {
                  const cat = CATEGORIES.find(c => c.key === item.category);
                  return (
                    <Link key={item.id} href={`/${item.category}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-ocean-50)] transition-colors"
                    >
                      <span className="flex items-center justify-center shrink-0 w-4 h-4 text-[var(--color-ocean-500)]"
                        dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[item.category] || "" }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-[var(--color-text)] truncate">{item.title}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]">{cat?.label}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">{formatTime(item.publishedAt)}</span>
                      </div>
                    </Link>
                  );
                }) : (
                  <div className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">暂无新闻</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
