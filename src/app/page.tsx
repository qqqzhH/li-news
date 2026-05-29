"use client";

import Link from "next/link";
import { getAllNews, getHotNews, formatTime } from "@/lib/news";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES, CATEGORY_ICONS } from "@/types";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Daily quotes - cycles based on date
const QUOTES = [
  { text: "信息筛选的能力，比信息获取的能力更重要", author: "" },
  { text: "新闻是历史的初稿", author: "菲利普·格雷厄姆" },
  { text: "在信息爆炸的时代，安静是一种力量", author: "" },
  { text: "读新闻的人，看到的是世界", author: "" },
  { text: "好的问题比好的答案更有价值", author: "" },
  { text: "每一天都是一张白纸，新闻是今天的笔迹", author: "" },
  { text: "理解世界，从阅读开始", author: "" },
  { text: "知天下事，方能立其身", author: "" },
  { text: "视野决定格局，新闻打开视野", author: "" },
  { text: "深度比速度更重要", author: "" },
  { text: "不要只读标题，要读内容", author: "" },
  { text: "信息自由是思想自由的前提", author: "" },
  { text: "保持好奇，保持质疑", author: "" },
  { text: "世界很大，新闻很近", author: "" },
  { text: "独立思考，从多元信息开始", author: "" },
  { text: "让信息为你所用，而非被信息淹没", author: "" },
  { text: "知识就是力量，新闻是知识的入口", author: "" },
  { text: "听见不同的声音，看见更远的地方", author: "" },
  { text: "新闻告诉你发生了什么，思考告诉你为什么", author: "" },
  { text: "阅读新闻，连接世界", author: "" },
  { text: "在变化中寻找不变", author: "" },
  { text: "事实是最好的论据", author: "" },
  { text: "每一个新闻背后，都有一个世界", author: "" },
  { text: "清醒的头脑，从阅读开始", author: "" },
  { text: "信息时代，选择看什么比看多少更重要", author: "" },
  { text: "理解不同，才能理解世界", author: "" },
  { text: "新闻是通向世界的窗口", author: "" },
  { text: "用信息武装自己，用思考照亮前路", author: "" },
  { text: "广度与深度，缺一不可", author: "" },
  { text: "在喧嚣中寻找真相", author: "" },
  { text: "阅读新闻，不仅是为了知道，更是为了理解", author: "" },
];

function getDailyQuote() {
  const today = new Date().toISOString().slice(0, 10); // "2026-05-30"
  const hash = today.split("-").reduce((s, n) => s + parseInt(n), 0);
  return QUOTES[hash % QUOTES.length];
}

export default function HomePage() {
  const data = getAllNews();
  const hotNews = getHotNews();
  const quote = getDailyQuote();

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
    tl.fromTo(titleRef.current, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(subtitleRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
      .fromTo(updRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.15")
      .fromTo(quoteRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.1")
      .fromTo(searchRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, "-=0.1")
      .fromTo(".cat-card", { opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.06 }, "-=0.15");

    // Typewriter effect for daily quote
    setTimeout(() => {
      const qEl = document.querySelector(".quote-text") as HTMLElement | null;
      if (!qEl) return;
      const fullText = qEl.getAttribute("data-text") || "";
      qEl.textContent = "";
      let i = 0;
      const tw = setInterval(() => {
        if (i < fullText.length) {
          qEl.textContent += fullText[i];
          i++;
        } else {
          clearInterval(tw);
        }
      }, 50);
    }, 600);

    gsap.to(arrowRef.current, { y: -6, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" });

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

      {/* ===== Screen 1: Hero ===== */}
      <section data-section="home" className="snap-start min-h-screen flex flex-col justify-center px-6 md:px-16 max-w-4xl mx-auto w-full">

        {/* Title */}
        <div className="text-center">
          <h1 ref={titleRef} className="text-7xl md:text-8xl font-black tracking-wide leading-none">
            <span className="text-[var(--color-ocean-600)]">木子</span>
            <span className="text-[var(--color-text)]">新闻</span>
          </h1>
          <p ref={subtitleRef} className="mt-5 text-sm md:text-base text-[var(--color-text-muted)] max-w-md mx-auto">
            AI 动态 · 机器人 · 地缘政治 · 金融市场
          </p>
          <div ref={updRef} className="mt-3 text-xs text-[var(--color-text-muted)]/60">
            <span>每日 9:00 自动更新</span>
            {data.lastUpdated && (
              <>
                <span className="mx-1.5 inline-block w-0.5 h-0.5 rounded-full bg-[var(--color-text-muted)]/40 align-middle" />
                <span>上次更新 {formatTime(data.lastUpdated)}</span>
              </>
            )}
          </div>
        </div>

        {/* Quote - daily */}
        <div ref={quoteRef} className="mt-12 text-center">
          <div className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--color-ocean-50)] to-blue-50 border border-[var(--color-ocean-100)] shadow-sm">
            <p className="quote-text text-base md:text-lg text-[var(--color-ocean-700)] font-serif italic leading-relaxed tracking-wide" data-text={quote.text}>
              <span className="text-2xl text-[var(--color-ocean-400)] leading-none mr-2">&ldquo;</span>
              {quote.text}
              <span className="text-2xl text-[var(--color-ocean-400)] leading-none ml-2">&rdquo;</span>
            </p>
            {quote.author && (
              <p className="text-xs text-[var(--color-text-muted)] mt-1.5">&mdash; {quote.author}</p>
            )}
          </div>
        </div>

        {/* Search */}
        <div ref={searchRef} className="mt-14 max-w-sm mx-auto w-full">
          <SearchBar large />
        </div>

        {/* Category cards - bigger */}
        <div ref={catsRef} className="mt-16 grid grid-cols-3 md:grid-cols-5 gap-5 max-w-3xl mx-auto w-full">
          {CATEGORIES.map((cat) => {
            const count = data.items.filter((i) => i.category === cat.key).length;
            return (
              <Link key={cat.key} href={`/${cat.key}`}
                className="cat-card bg-white border border-[var(--color-border)] rounded-xl py-6 px-4 text-center hover:border-[var(--color-ocean-400)] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-250"
              >
                <div className="flex justify-center mb-3 text-[var(--color-ocean-500)] scale-110">
                  <span dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[cat.key] || "" }} />
                </div>
                <div className="text-sm font-semibold text-[var(--color-text)]">{cat.label}</div>
                <div className="text-[11px] text-[var(--color-text-muted)] mt-1">{count} 条</div>
              </Link>
            );
          })}
        </div>

        {/* Arrow */}
        <div ref={arrowRef} className="mt-16 flex flex-col items-center gap-1.5 text-[var(--color-text-muted)]/50 cursor-pointer">
          <span className="text-xs tracking-widest">探索</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ===== Screen 2: 今日精选 ===== */}
      <section data-section="recommended" className="snap-start min-h-screen flex flex-col items-center justify-center px-6 md:px-16" ref={section2Ref}>
        <div className="w-full max-w-5xl pt-[25vh]">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="s2-title-line h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-ocean-300)] to-transparent max-w-[120px]" />
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text)] tracking-tight">今日精选</h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">推荐阅读 · 最新动态</p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-ocean-300)] to-transparent max-w-[120px]" />
          </div>

          {/* Two columns - more spacious */}
          <div className="s2-cols grid md:grid-cols-2 gap-8 md:gap-16">
            {/* Left: Recommended */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text)]">推荐阅读</h3>
              </div>
              <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-2xl overflow-hidden bg-white shadow-sm">
                {hotNews.slice(0, 5).length > 0 ? hotNews.slice(0, 5).map((item, idx) => (
                  <Link key={item.id} href={`/${item.category}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-[var(--color-ocean-50)] transition-colors group"
                  >
                    <span className={`flex items-center justify-center w-7 h-7 rounded-xl text-xs font-bold shrink-0 ${idx < 3 ? "bg-red-50 text-red-500" : "bg-gray-50 text-[var(--color-text-muted)]"}`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-ocean-700)] transition-colors">{item.title}</div>
                      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatTime(item.publishedAt)}</div>
                    </div>
                  </Link>
                )) : (
                  <div className="px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">暂无推荐</div>
                )}
              </div>
            </div>

            {/* Right: Latest */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-ocean-50)] to-blue-50 border border-[var(--color-ocean-200)]">
                  <svg className="w-4 h-4 text-[var(--color-ocean-500)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text)]">最新动态</h3>
              </div>
              <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-2xl overflow-hidden bg-white shadow-sm">
                {data.items.slice(0, 5).length > 0 ? data.items.slice(0, 5).map((item) => {
                  const cat = CATEGORIES.find(c => c.key === item.category);
                  return (
                    <Link key={item.id} href={`/${item.category}`}
                      className="flex items-center gap-3 px-5 py-4 hover:bg-[var(--color-ocean-50)] transition-colors group"
                    >
                      <span className="flex items-center justify-center shrink-0 w-5 h-5 text-[var(--color-ocean-400)] group-hover:text-[var(--color-ocean-600)] transition-colors"
                        dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[item.category] || "" }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-ocean-700)] transition-colors">{item.title}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-bg-alt)] text-[var(--color-text-muted)] font-medium">{cat?.label}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">{formatTime(item.publishedAt)}</span>
                      </div>
                    </Link>
                  );
                }) : (
                  <div className="px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">暂无新闻</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
