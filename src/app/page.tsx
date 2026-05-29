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

  const heroRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const bounceRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8 })
      .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .fromTo(".search-wrapper", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
      .fromTo(".cat-card", { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08 }, "-=0.2");

    // Float animation on bounce arrow
    gsap.to(bounceRef.current, { y: -8, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // Section titles animation on scroll
    gsap.utils.toArray<HTMLElement>(".section-title-line").forEach((el) => {
      gsap.fromTo(el,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        }
      );
    });

    // Content items stagger on scroll
    gsap.utils.toArray<HTMLElement>(".scroll-item").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
        {
          opacity: 1, x: 0, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" }
        }
      );
    });

    // Floating background blobs
    gsap.utils.toArray<HTMLElement>(".bg-blob").forEach((el, i) => {
      gsap.to(el, {
        x: i === 0 ? 30 : -30,
        y: i === 0 ? -20 : 20,
        duration: 4 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="snap-container space-y-0 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="bg-blob absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[var(--color-ocean-50)] to-transparent opacity-40" />
        <div className="bg-blob absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-tl from-[var(--color-ocean-50)] to-transparent opacity-30" />
      </div>

      {/* ===== Screen 1: 首页 ===== */}
      <section
        data-section="home"
        className="snap-start min-h-screen flex flex-col justify-center px-2 relative z-10"
        ref={sectionsRef}
      >
        <div ref={heroRef}>
          {/* 标题 */}
          <div className="text-center pt-6 pb-4">
            <h1
              ref={titleRef}
              className="text-6xl md:text-7xl font-bold tracking-tight"
            >
              <span className="text-[var(--color-ocean-600)]">木子</span>
              <span className="text-[var(--color-text)]">新闻</span>
            </h1>
            <p
              ref={subtitleRef}
              className="text-[var(--color-text-secondary)] text-base md:text-lg max-w-lg mx-auto leading-relaxed mt-3"
            >
              AI 动态 · 机器人 · 地缘政治 · 金融市场
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)]">
              <span>每日 9:00 自动更新</span>
              {data.lastUpdated && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)]" />
                  <span>上次更新 {formatTime(data.lastUpdated)}</span>
                </>
              )}
            </div>
          </div>

          {/* 搜索 */}
          <div className="search-wrapper max-w-sm mx-auto mb-8">
            <SearchBar />
          </div>

          {/* 5 大板块 */}
          <div
            ref={categoriesRef}
            className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-2xl mx-auto w-full"
          >
            {CATEGORIES.map((cat) => {
              const count = data.items.filter((i) => i.category === cat.key).length;
              return (
                <Link
                  key={cat.key}
                  href={`/${cat.key}`}
                  className="cat-card bg-white/80 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl p-5 text-center hover:border-[var(--color-ocean-300)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-center mb-3 text-[var(--color-ocean-600)]">
                    <span dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[cat.key] || "" }} />
                  </div>
                  <div className="text-sm font-semibold text-[var(--color-text)]">{cat.label}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">{count} 条</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 向下提示 */}
        <div ref={bounceRef} className="mt-auto pb-6 text-center text-[var(--color-text-muted)]">
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ===== Screen 2: 推荐阅读 + 最新动态（左右并列） ===== */}
      <section
        data-section="recommended"
        className="snap-start min-h-screen flex flex-col justify-center px-2 relative z-10"
      >
        <div className="max-w-4xl mx-auto w-full">
          {/* 主标题 */}
          <div className="text-center mb-8">
            <div className="section-title-line h-0.5 w-16 mx-auto bg-[var(--color-ocean-400)] rounded-full mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
              今日精选
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              推荐阅读与最新动态
            </p>
          </div>

          {/* 左右双栏 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 左栏：推荐阅读 */}
            <div>
              <h3 className="section-title-line text-lg font-semibold text-[var(--color-ocean-600)] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth={1.5}/>
                </svg>
                推荐阅读
              </h3>
              <div className="divide-y divide-[var(--color-border-light)] border border-[var(--color-border)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
                {hotNews.slice(0, 5).map((item, idx) => (
                  <Link
                    key={item.id}
                    href={`/${item.category}`}
                    className="scroll-item flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-ocean-50)] transition-colors"
                  >
                    <span className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold shrink-0 ${idx < 3 ? "bg-red-50 text-red-500" : "bg-gray-50 text-[var(--color-text-muted)]"}`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-[var(--color-text)] truncate">{item.title}</h4>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatTime(item.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 右栏：最新动态 */}
            <div>
              <h3 className="section-title-line text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-ocean-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                最新动态
              </h3>
              <div className="divide-y divide-[var(--color-border-light)] border border-[var(--color-border)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
                {data.items.slice(0, 5).map((item) => {
                  const cat = CATEGORIES.find((c) => c.key === item.category);
                  return (
                    <Link
                      key={item.id}
                      href={`/${item.category}`}
                      className="scroll-item flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-ocean-50)] transition-colors"
                    >
                      <span
                        className="flex items-center justify-center shrink-0 w-4 h-4 text-[var(--color-ocean-500)]"
                        dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[item.category] || "" }}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm text-[var(--color-text)] truncate">{item.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]">
                          {cat?.label}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)]">{formatTime(item.publishedAt)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
