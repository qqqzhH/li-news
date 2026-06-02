"use client";

export default function ExploreButton() {
  return (
    <div
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex flex-col items-center gap-1 py-10 sm:py-16 text-[var(--color-text-muted)]/50 cursor-pointer"
    >
      <span className="text-xs tracking-widest">探索</span>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );
}
