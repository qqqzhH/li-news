"use client";
import { useEffect } from "react";

// 多个标题彩蛋文案，每天随机选一个
// 注意：只用有字形的字符（✿◕‿✧٩等在中文字体缺字形会显示成空白/豆腐块）
const TITLES = [
  { leave: "(╯°□°)╯ 页面飞走了", back: "( ◦ °ω° ◦ ) 飞回来了~" },
  { leave: "〔ﾟДﾟ〕 页面不见了！", back: "(ﾟωﾟ) 还在！" },
  { leave: "Σ(°△°|||) 页面已失踪", back: "ヽ(°▽°)ノ 找到你啦~" },
  { leave: "(×﹏×) 页面崩溃惹", back: "( °▽°*) 恢复成功~" },
  { leave: "(°A°) 页面崩溃啦", back: "(>ω<) 噫又好了~" },
];

export default function TabTitleTrick() {
  useEffect(() => {
    const orig = document.title;
    const today = new Date().toISOString().slice(0, 10);
    const idx = today.split("-").reduce((s, n) => s + parseInt(n), 0) % TITLES.length;
    const t = TITLES[idx];
    let timeout: ReturnType<typeof setTimeout>;

    const handle = () => {
      clearTimeout(timeout);
      document.title = document.hidden ? t.leave : t.back;
      if (!document.hidden) {
        timeout = setTimeout(() => { document.title = orig; }, 3000);
      }
    };

    document.addEventListener("visibilitychange", handle);
    return () => {
      document.removeEventListener("visibilitychange", handle);
      clearTimeout(timeout);
    };
  }, []);
  return null;
}
