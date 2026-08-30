"use client";
import { useEffect } from "react";

// 多个标题彩蛋文案，每天随机选一个
// 注意：只用有字形的字符（✿◕‿✧٩等在中文字体缺字形会显示成空白/豆腐块）
const TITLES = [
  // —— 原创经典组 ——
  { leave: "(╯°□°)╯ 页面飞走了", back: "( ◦ °ω° ◦ ) 飞回来了~" },
  { leave: "〔ﾟДﾟ〕 页面不见了！", back: "(ﾟωﾟ) 还在！" },
  { leave: "Σ(°△°|||) 页面已失踪", back: "ヽ(°▽°)ノ 找到你啦~" },
  { leave: "(×﹏×) 页面崩溃惹", back: "( °▽°*) 恢复成功~" },
  { leave: "(°A°) 页面崩溃啦", back: "(>ω<) 噫又好了~" },
  // —— 创意组 ——
  { leave: "(つω⊂) 你快回来", back: "ヽ(°▽°)ノ 你终于回来了" },
  { leave: "(×﹏×) 你别走啊，新闻还没看完", back: "( °ω° ) 你总算回来了，我等了好久" },
  { leave: "(°ω°)? 偷偷摸摸跑哪去了？", back: "(^▽^) 可算把你盼回来了" },
  { leave: "(^-^)/ 去去就回", back: "(^-^) 回来了就请坐" },
  { leave: "(>_<) 页面在等你回家", back: "(=^▽^=) 主人，你到家了" },
  { leave: "(つ﹏⊂) 别丢下我", back: "(つ°▽°)つ 抱抱你" },
  // —— 新增组 ——
  { leave: "(°ω°)? 哼，你是不是背着我逛别的站了", back: "( ^▽^ ) 算了算了，回来就好" },
  { leave: "(>_<) 摸鱼被老板抓了吗", back: "(^▽^)/ 平安回来，继续摸鱼" },
  { leave: "(=^ω^=)喵？主人去哪了", back: "(=^ω^=)喵！蹭蹭你" },
  { leave: "(°ω°)〔侦探模式〕线索中断…", back: "ヽ(°▽°)ノ〔案件告破〕目标回来了" },
  { leave: "【掉线】(×﹏×)", back: "ヽ(°▽°)ノ【重新连接成功】" },
  { leave: "(ﾟωﾟ)? 你是不是去刷抖音了", back: "(°▽°) 玩够了吗？新闻都凉了" },
  { leave: "(×﹏×) 你背着我看别的新闻？", back: "( ^ω^ ) 哼，原谅你了" },
  { leave: "(つω⊂) 别走嘛再看一眼", back: "(°▽°*) 就知道你舍不得我" },
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
