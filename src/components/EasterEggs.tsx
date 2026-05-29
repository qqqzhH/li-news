"use client";
import { useEffect, useState } from "react";

export default function EasterEggs() {
  const [hacker, setHacker] = useState(false);

  useEffect(() => {
    // ===== 深夜模式 =====
    const checkNight = () => {
      const h = new Date().getHours();
      const el = document.getElementById("night-bar");
      if (!el) return;
      if (h >= 22 || h < 6) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    };
    checkNight();
    const nightTimer = setInterval(checkNight, 60000);

    // ===== 黑客模式 (Ctrl+H) =====
    const keyHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "h") {
        e.preventDefault();
        setHacker((v) => !v);
      }
    };
    window.addEventListener("keydown", keyHandler);

    return () => {
      clearInterval(nightTimer);
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);

  // 黑客模式 class 同步到 html
  useEffect(() => {
    document.documentElement.classList.toggle("hacker-mode", hacker);
  }, [hacker]);

  return (
    <>
      {/* 深夜提示条 */}
      <div
        id="night-bar"
        className="hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-900/90 to-slate-900/90 backdrop-blur-sm border border-indigo-700/50 shadow-lg"
      >
        <p className="text-sm text-indigo-200 flex items-center gap-2">
          <span>🌙</span>
          深夜了，还在看新闻？注意休息哦
          <span className="text-indigo-400 text-xs ml-1">(´･ω･`)</span>
        </p>
      </div>

      {/* 黑客模式指示器 */}
      {hacker && (
        <div className="fixed top-3 right-4 z-50 text-[10px] text-green-400 font-mono tracking-widest opacity-60 pointer-events-none select-none">
          HACKER MODE • Ctrl+H
        </div>
      )}
    </>
  );
}
