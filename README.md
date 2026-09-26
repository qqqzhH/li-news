# 木子新闻 | LI News

个人智能新闻站：AI 动态 · 机器人 · 地缘政治 · 金融市场 · 其他要闻。
每日 9:00 自动采集 + AI 摘要/解读，静态发布。

线上地址：https://li-news.pages.dev（主站 panpan.xyz 的 /news、/ai 等路径 302 过来）。

## 四条产品线与数据流

```
新闻源（AIHOT API + Exa Search×3 + 新浪×2/雷锋网抓取）
  │ scripts/fetch-news.js   清洗 → 标题去重(前50字) → 72h新鲜度闸门
  │                         → DeepSeek 摘要 → AI 解读 → 3 个月保留窗口
  ▼
src/data/news.json          ← 唯一数据源（唯一写入者：服务器 cron）
  │ scripts/sync-news.mjs   构建期生成 6 个数据 TS 文件（**已 gitignore，不出 git**——
  │                         2026-09-26 单源化：prebuild 自动跑，git 冲突面归零）：
  ├─ src/lib/news.ts        轻量版（摘要截80字/无deepDive）→ 首页 + 搜索（进客户端 bundle）
  └─ src/lib/news-{cat}.ts  全量版 → 各分类页（构建期进 HTML）
  │ scripts/gen-daily-summary.mjs（管线内）→ src/lib/daily-summary.ts → 首页"今日新闻总结"
  ▼
next build（output: export，11 个静态页）→ git push → Cloudflare 自动部署
```

关联产品线（仓库外）：**墨极日报 / archive 温故知新 / 墨极·YYYYMMDD 往期快照**
在主仓 panpan.xyz（本地 personal-site 副本），由 Windows 任务计划 GenMojiDaily
每日 10:27 跑 `tools/auto-moji-daily.sh`（pull → 生成日报 → ssh 拉本仓库 news.json
更新 archive → 当日快照 → push）。

## 单一写入者政策（重要）

**新闻数据文件只能由服务器采集端写入推送**：阿里云杭州 47.96.236.50 的
`/opt/li-news/daily-collection.sh`（系统 cron `0 9` 主任务 + `30 9` 远端口径兜底 +
`50 10` 健康探针 health-probe.sh）。

- 本地仓库装有 `.git/hooks/pre-push`：推送含 `src/data/news.json`、
  `src/lib/news*.ts`、`src/lib/daily-summary.ts` 的提交会被拒绝。
  纯代码改动正常推送。
- 补数据的正确姿势：`ssh root@47.96.236.50 '/opt/li-news/daily-collection.sh'`
- 服务器 push 失败/采集失败会写 `/opt/li-news/status.json`、`ALERT` 并尝试通知
  （通知通道是可插拔的：放一个可执行 `/opt/li-news/notify.sh LEVEL MESSAGE` 即接线）。
- 背景：2026-09-09~09-25 曾因"服务器 cron + Windows 手工"双写入端分叉 17 个提交、
  rebase 卡死、线上停更 4 天。修复方式：union 合并收编（commit f48703f）+ 本政策。

## 本地开发

```bash
npm install          # Node 22（服务器同版本）；本机 24 也可跑
npm run dev          # 开发服务器 localhost:3000
npm run build        # 静态导出到 out/（next build 是事实上的回归测试）
npm test             # node --test tests/（见下方测试说明）
npx eslint src scripts tests
```

> Windows 本地 push 需代理：仓库已配 `http.proxy=127.0.0.1:7897`。
> fetch-news 需要 env：`DEEPSEEK_API_KEY`（摘要/解读）、`EXA_API_KEY`（Exa 搜索，
> 缺失时优雅跳过仅用 AIHOT+抓取源）。直接 `node scripts/fetch-news.js` 会真实调 API。

## 测试

```bash
node --test tests/feed.test.mjs              # feed.xml 构建产物断言（先 npm run build）
node --test tests/cat-colors.test.mjs        # NewsCard 色板覆盖全部分类
node --test tests/fetch-news-utils.test.mjs  # 采集管线纯函数（去重/截断/日期/清洗等）
# 注意：本机环境下 `node --test tests/`（目录形式）会把目录当测试目标报错，请逐文件跑
```

## 目录速览

- `src/app/` 页面（/ 首页、5 个分类页、/search、feed.xml 路由）
- `src/components/` NewsCard（手写 markdown 渲染）/ Sidebar / SearchBar / 彩蛋×2
- `src/lib/` 数据文件全部为生成物，**勿手改**（头部有 do not edit 标记）
- `scripts/` fetch-news.js（采集）、sync-news.mjs（双写）、summarize.js（DeepSeek）、
  gen-daily-summary.mjs（首页日报）
- `tests/` node:test 零依赖测试

## 已知边界（勿当 bug 重复报）

- feed.xml 1500+ 条无上限；分类页无分页（ai.html 构建产物 ~3.5MB）——架构级
  改动需专项评估（历史上分片方案就是为了绕 CF Worker 461KB 限制）。
- other 分类恒为空（采集源不产出 other）；Sidebar"RSS 订阅"是死文本无链接。
- `EXA_API_KEY` 曾硬编码进 git 历史（已于 2026-09-25 移出源码改 env 注入）；
  该 key 未轮换，轮换需在 Exa 后台操作并同步更新服务器 env。
- Next.js 16 与常规认知有差异，改代码前先读 `node_modules/next/dist/docs/`（见 AGENTS.md）。
