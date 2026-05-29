"use client";

import Link from "next/link";
import { getAllNews, getHotNews, formatTime } from "@/lib/news";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES, CATEGORY_ICONS } from "@/types";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HomePage() {
  const data = getAllNews();
  const hotNews = getHotNews();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const bounceRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // === Screen 1: Hero entrance ===
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { opacity: 0, y: -50, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.9 })
      .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .fromTo(quoteRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.1")
      .fromTo(".search-wrapper", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.1")
      .fromTo(".cat-card", { opacity: 0, y: 30, scale: 0.88 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07 }, "-=0.2");

    // Bounce arrow
    gsap.to(bounceRef.current, { y: -10, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // === Screen 2: Content staggered entrance ===
    gsap.fromTo(".section2-title", { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
      scrollTrigger: { trigger: ".section2-title", start: "top 80%", toggleActions: "play none none none" }
    });
    gsap.fromTo(".section2-col", { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: ".section2-col", start: "top 80%", toggleActions: "play none none none" }
    });

    // Items stagger
    gsap.utils.toArray<HTMLElement>(".item-row").forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.35, delay: i * 0.04, ease: "power2.out",
        scrollTrigger: { trigger: el.closest(".section2-col"), start: "top 85%", toggleActions: "play none none none" }
      });
    });

    // Floating blobs
    gsap.utils.toArray<HTMLElement>(".bg-blob").forEach((el, i) => {
      gsap.to(el, { x: i % 2 === 0 ? 25 : -25, y: i % 2 === 0 ? -15 : 15, duration: 5 + i, repeat: -1, yoyo: true, ease: "sine.inOut" });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div className="snap-container space-y-0 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="bg-blob absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[var(--color-ocean-50)] via-transparent to-transparent opacity-50" />
        <div className="bg-blob absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-blue-50 via-transparent to-transparent opacity-40" />
        <div className="bg-blob absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-50 to-transparent opacity-30" />
      </div>

      {/* ===== Screen 1: Hero ===== */}
      <section data-section="home" className="snap-start min-h-screen flex flex-col justify-center px-4 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto w-full">
          {/* Brand */}
          <div className="text-center mb-6">
            <h1 ref={titleRef} className="text-7xl md:text-8xl font-bold tracking-tight leading-none">
              <span className="text-[var(--color-ocean-600)]">木子</span>
              <span className="text-[var(--color-text)]">新闻</span>
            </h1>
            <p ref={subtitleRef} className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-lg mx-auto leading-relaxed mt-4">
              AI 动态 · 机器人 · 地缘政治 · 金融市场
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)]">
              <span>每日 9:00 自动更新</span>
              {data.lastUpdated && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)]" />
                  <span>上次更新 {formatTime(data.lastUpdated)}</span>
                </>
              )}
            </div>
          </div>

          {/* Quote */}
          <div ref={quoteRef} className="text-center mb-7">
            <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-ocean-50)] to-blue-50 border border-[var(--color-ocean-100)]">
              <p className="text-sm md:text-base text-[var(--color-ocean-700)] italic font-serif tracking-wide">
                &ldquo; 信息筛选的能力，比信息获取的能力更重要 &rdquo;
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="search-wrapper max-w-md mx-auto mb-10">
            <SearchBar />
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-3xl mx-auto">
            {CATEGORIES.map((cat) => {
              const count = data.items.filter((i) => i.category === cat.key).length;
              return (
                <Link key={cat.key} href={`/${cat.key}`}
                  className="cat-card bg-white/80 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl p-4 md:p-5 text-center hover:border-[var(--color-ocean-300)] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="flex justify-center mb-2.5 text-[var(--color-ocean-600)]">
                    <span dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[cat.key] || "" }} />
                  </div>
                  <div className="text-sm font-semibold text-[var(--color-text)]">{cat.label}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{count} 条</div>
                </Link>
              );
            })}
          </div>
        </div>

        <div ref={bounceRef} className="mt-auto pb-6 text-center text-[var(--color-text-muted)]">
          <svg className="w-6 h-6 mx-auto opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ===== Screen 2: 今日精选（推荐 + 最新 左右并排） ===== */}
      <section data-section="recommended" className="snap-start min-h-screen flex flex-col justify-center px-4 md:px-8 relative z-10" ref={section2Ref}>
        <div className="max-w-5xl mx-auto w-full">
          {/* Section title */}
          <div className="section2-title text-center mb-8 md:mb-10">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="h-px w-12 bg-[var(--color-ocean-300)]" />
              <div className="w-2 h-2 rotate-45 bg-[var(--color-ocean-500)]" />
              <div className="h-px w-12 bg-[var(--color-ocean-300)]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight">今日精选</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">推荐阅读 · 最新动态</p>
          </div>

          {/* Two columns */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Left: Recommended */}
            <div className="section2-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth={1.5}/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)]">推荐阅读</h3>
              </div>
              <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm shadow-sm">
                {hotNews.slice(0, 5).length > 0 ? hotNews.slice(0, 5).map((item, idx) => (
                  <Link key={item.id} href={`/${item.category}`}
                    className="item-row flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--color-ocean-50)] transition-colors"
                  >
                    <span className={`flex items-center justify-center w-7 h-7 rounded-xl text-xs font-bold shrink-0 ${idx < 3 ? "bg-red-50 text-red-500" : "bg-gray-50 text-[var(--color-text-muted)]"}`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[var(--color-text)] truncate">{item.title}</div>
                      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatTime(item.publishedAt)}</div>
                    </div>
                  </Link>
                )) : (
                  <div className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)]">暂无推荐内容</div>
                )}
              </div>
            </div>

            {/* Right: Latest */}
            <div className="section2-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-ocean-50)] to-blue-50 border border-[var(--color-ocean-200)]">
                  <svg className="w-4 h-4 text-[var(--color-ocean-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)]">最新动态</h3>
              </div>
              <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm shadow-sm">
                {data.items.slice(0, 5).length > 0 ? data.items.slice(0, 5).map((item) => {
                  const cat = CATEGORIES.find(c => c.key === item.category);
                  return (
                    <Link key={item.id} href={`/${item.category}`}
                      className="item-row flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--color-ocean-50)] transition-colors"
                    >
                      <span className="flex items-center justify-center shrink-0 w-5 h-5 text-[var(--color-ocean-500)]"
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
                  <div className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)]">暂无新闻</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
