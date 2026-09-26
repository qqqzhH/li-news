# ARCHITECTURE — 架构说明与决策记录

> 写给未来维护者：这里是"为什么这样设计"。操作方法看 README，问题台账看 KNOWN-ISSUES.md，
> 变更史看 CHANGELOG.md。所有决策以实际代码为准，与代码冲突时先信代码、再改这里。

## 模块关系（代码视角，README 的数据流图是运维视角）

```
scripts/fetch-news.js ──写──▶ src/data/news.json（唯一数据源，git 内）
        │ require                      ▲
        └──▶ scripts/summarize.js（DeepSeek 摘要）   │
scripts/gen-daily-summary.mjs ──写──▶ src/lib/daily-summary.ts（git 内，例外见 D5）
scripts/sync-news.mjs ──构建期生成（gitignore，见 D3）──▶ src/lib/news.ts + news-{cat}.ts
src/app/*/page.tsx ──import──▶ 上述 lib 数据文件 ──▶ NewsCard/PagedNewsList 渲染
服务器 daily-collection.sh 串起：fetch-news → sync-news → gen-daily-summary → commit → push → CF build
```

## 设计决策记录

### D1 静态导出 + Cloudflare Pages，不用服务器托管
【问题】新闻站部署在哪。【方案】`output: "export"` 纯静态，CF Pages git push 自动构建。
【为什么】杭州机房无 ICP 备案 80/443 被阻断；2G 服务器跑不动 next build。
【缺点】页面数据构建期固化（每天 9:00 更新一次）；CRON 时段内数据不变是产品接受的行为。

### D2 数据轻量/全量双份拆分
【问题】数据曾撑爆 CF Worker 461KB 限制。【方案】sync-news.mjs 生成轻量 news.ts
（摘要截 80 字、无 deepDive，进首页/搜索客户端 bundle）+ 每分类全量 TS（构建期进 HTML）。
【为什么】首页不需要全量 deepDive；分类页拆文件避免单文件过大。
【缺点】双份派生数据（由 D3 缓解）；分类页 HTML 仍内嵌全量数据（~3.5MB，见重构方向）。

### D3 数据单源化：生成物出 git + prebuild 重建（2026-09-26）
【问题】news.json + 6 个生成 TS 双份入库，曾致 17 提交 git 分叉事故。
【方案】6 个生成 TS `git rm --cached` + gitignore；`prebuild/predev` 自动跑 sync-news.mjs。
CF Pages build_command=`npm run build`（API 查证），npm 生命周期自动生效。
【为什么】git 内数据源唯一 = news.json，数据冲突面结构性归零。
【缺点】新 clone 后必须先跑过 prebuild 才有数据文件（npm run dev/build 自动解决）；
CF 构建依赖 npm registry 可用性。

### D4 单一写入者 + pre-push 拦截钩子
【问题】服务器 cron 与 Windows 手工双写导致分叉。【方案】数据文件只许服务器推；
Windows 仓库 `.git/hooks/pre-push` 拦含 `news.json/news*.ts/daily-summary.ts` 的推送
（`--diff-filter=ACMR`：删除出 git 的提交不拦）。【缺点】钩子不进 git，重 clone 需重装（见 KNOWN-ISSUES）。

### D5 daily-summary.ts 例外留在 git
【为什么】它由 gen-daily-summary.mjs 生成但需要 DeepSeek key，CF 构建环境没有——
prebuild 只能跑无 API 依赖的 sync。它是唯一一个"生成物 + 入库"的数据文件，
同样受 D4 钩子拦截保护。

### D6 采集静默降级阈值 = 20
【背景】Exa×3 与 scrape×3 吞错返回空时 fetch 仍 exit 0（AIHOT 无 catch，挂=Fatal，
两者互补成完整覆盖）。【标定】正常实测 34；Exa 挂实测 15。阈值 20 覆盖"付费源先挂"
场景且不误报。【缺点】未经过周末/节假日长期验证（见 KNOWN-ISSUES #4）。

### D7 告警 = 邮件，工具全局化
【用户拍板】不用手机推送（Bark 否决）。服务器级工具 `/usr/local/bin/notify-email`
（任何项目接入：`NOTIFY_PROJECT="x" notify-email LEVEL "msg"`），标题格式
`[项目][严重/警告/告警/日常] 首行提炼`，15 分钟节流。接入文档在 GBrain `backup-ledger`/`notify-email-global` 页。

### D8 sharp 漏洞豁免（2026-09-26 验证）
npm audit 14 漏洞全在 sharp/libvips 传递依赖。验证：产物 JS 无 sharp 加载特征、
采集脚本不 require、站点从不处理用户图片——零暴露面。**勿跑 `npm audit fix --force`**
（会升 next 大版本）。未来若引入图片功能需重新评估。

## 不能轻易修改的地方（改动前必须想清楚）

1. **去重键 = 标题前 50 字符小写**（fetch-news.js `deduplicate` + 合并脚本同款）：
   存量 1600+ 条数据按此键合并生成，换键会让历史数据无法去重。
2. **cleanText/smartTruncate 的中文站正则**：直接影响每天的内容质量，改动无法肉眼回归
   （只能靠采样对比）。测试在 tests/fetch-news-utils.test.mjs 锁定了现状行为。
3. **news.json 字段结构**（types/index.ts `NewsItem`）：sync、生成器、主仓 archive 生成器、
   墨极日报生成器都消费它——动结构是跨仓库联动。
4. **sync-news.mjs 的生成格式**：决定客户端 bundle 结构；改它等于重新做 D2。
5. **服务器脚本路径约定**：`/opt/li-news/*`、`/root/.hermes/.env` 键名（SMTP_*/ALERT_TO/
   DEEPSEEK_API_KEY/EXA_API_KEY）——脚本、探针、notify-email 多处引用。

## 隐含依赖（README 数据流图上看不见的）

| 依赖 | 断裂后果 |
|---|---|
| `.git/hooks/pre-push` 是本地文件 | 重 clone 后单一写入者第二道保险消失，需手动重装 |
| daily-collection.sh 依赖 `/root/.hermes/.env` 键名 | 换 key 名 = 采集静默降级（好在有 NEW_ITEMS_COUNT 兜底） |
| health-probe 依赖 status.json 的 `date` 字段语义 | 改 daily-collection 写 status 的格式会让探针永远报红/报绿 |
| NewsCard `catColors` ↔ `CATEGORIES` 键 | 新增分类漏配色会回退灰色（tests/cat-colors 锁定） |
| li-news `public/_redirects` ↔ 主仓 `_redirects` | 两边规则互指会成循环（现状已核：主站无 archive/moji_daily 规则） |
| 主仓 GenMojiDaily ssh 拉**服务器工作区** news.json | 服务器工作区 json 被手动改动会直接进墨极日报 archive |

## 未来重构方向（按价值排序，动前单独立项）

1. 分类页 HTML 内嵌全量数据（~3.5MB）→ 数据出产物、运行时按需拉取；
   需评估 CF 缓存与首屏行为（D1 的"构建期固化"会变）。
2. other 分类：接一个真实源，或彻底移除分类与数据文件（现在是"藏入口"的半状态）。
3. pre-push 钩子入库（scripts/hooks/ + 安装脚本），让单一写入者保险随 clone 走。
4. sync-news.mjs 补快照测试——它已是构建关键路径（prebuild 失败 = 部署失败）。
