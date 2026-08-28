"use client";
import { useEffect } from "react";

// 多个标题彩蛋文案，每天随机选一个
// 注意：只用有字形的字符（✿◕‿✧٩等在中文字体缺字形会显示成空白/豆腐块）
const TITLES = [
  // —— 原创经典组 ——
  { leave: "(╯°□°)╯ 页面飞走了", back: "( ◦ °ω° ◦ ) 飞回来了~" },
  { leave: "Σ(°△°|||) 页面已失踪", back: "ヽ(°▽°)ノ 找到你啦~" },
  { leave: "(×﹏×) 页面崩溃惹", back: "( °▽°*) 恢复成功~" },
  { leave: "(°A°) 页面崩溃啦", back: "(>ω<) 噫又好了~" },
  // 吃醋版
  { leave: "(°ω°)? 哼，你是不是背着我逛别的站了", back: "( ^▽^ ) 算了算了，回来就好" },
  // 打工人梗
  { leave: "(>_<) 摸鱼被老板抓了吗", back: "(^▽^)/ 平安回来，继续摸鱼" },
  // 猫咪风
  { leave: "(=^ω^=)喵？主人去哪了", back: "(=^ω^=)喵！蹭蹭你" },
  // 侦探风
  { leave: "(°ω°)〔侦探模式〕线索中断…", back: "ヽ(°▽°)ノ〔案件告破〕目标回来了" },
  // 游戏风
  { leave: "【掉线】(×﹏×)", back: "ヽ(°▽°)ノ【重新连接成功】" },
  // 手机依赖梗
  { leave: "(ﾟωﾟ)? 你是不是去刷抖音了", back: "(°▽°) 玩够了吗？新闻都凉了" },
  // 醋坛子
  { leave: "(×﹏×) 你背着我看别的新闻？", back: "( ^ω^ ) 哼，原谅你了" },
  // 直球可爱
  { leave: "(つω⊂) 别走嘛再看一眼", back: "(°▽°*) 就知道你舍不得我" },
  // 系统通知风
  { leave: "【系统】目标失联(×﹏×)", back: "ヽ(°▽°)ノ【系统】目标已归位" },
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
