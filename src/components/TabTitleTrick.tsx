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
  // —— 新增创意组（全部用中文字符，不会缺字形）——
  { leave: "你快回来", back: "你终于回来了" },
  { leave: "你别走啊，新闻还没看完", back: "你总算回来了，我等了好久" },
  { leave: "偷偷摸摸跑哪去了？", back: "可算把你盼回来了" },
  { leave: "人走楼空…", back: "欢迎回来，继续看新闻" },
  { leave: "〔去去就回〕", back: "〔回来了就请坐〕" },
  { leave: "页面在等你回家", back: "主人，你到家了" },
  { leave: "(つ﹏⊂) 别丢下我", back: "(つ°▽°)つ 抱抱你" },
  { leave: "风里雨里，新闻等你", back: "你来啦，新闻都给你留着" },
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
