# CHANGELOG — 维护记录

> 格式：时间 / 原因 / 内容 / 涉及文件 / 测试 / 遗留。
> 代码变更在 git log 里有同款信息；本文件额外登记**服务器侧与流程变更**（不在任何 git 仓库里），
> 以及每轮维护的"为什么"。细节决策见 ARCHITECTURE.md，问题见 KNOWN-ISSUES.md。

## 2026-09-25 深夜 ~ 09-26 凌晨：三线断更修复（第一次大维护）

**原因**：审计发现三条产品线同时断更（li-news 线上停 9/21、墨极日报停 9/6、首页今日总结停 9/15）且无任何告警。

**代码（git）**：
- feed.xml siteUrl 占位符 → li-news.pages.dev（RSS 三处死链修复，a5dc0b7）
- NewsCard 色板补 robotics 键（初版遗漏，4d72f90）
- union 合并双端分叉 17 提交：news.json 1514+1265→1563 条 0 重复，TS 由 sync 重生成（f48703f）——9/13/14/16/17 独有数据恢复上线
- EXA_API_KEY 出库改 env 注入；fetch-news 加 require.main 守卫+导出纯函数（0c6c849/7ae7d9a）
- 删 backup-original-20260828/ 与 5 个一次性脚本；README 重写为真实运维文档

**服务器（不在 git）**：
- daily-collection.sh v2：fallback 判定改远端口径（旧逻辑被堆积提交污染、掩盖故障）；失败写 status.json + notify 钩子；gen-daily-summary 接入管线
- health-probe.sh 新增（cron 50 10 * * *）：检查今日推送/线上 feed ≤36h/线上墨极日报
- /opt/li-news/notify.sh 邮件告警（后全局化）
- 部署当晚兜底路径意外触发一次完整夜间采集——全链路实跑验证成功

**流程/机制**：
- 单一写入者政策确立；Windows 仓库 pre-push 钩子（拦数据推送、放行代码）
- 测试体系建立：tests/ 4 文件（feed 产物/色板覆盖/纯函数/冻结副本）
- 墨极日报自动化复活：personal-site 脏工作区清理 + auto-moji-daily.sh 自愈加固（LastTaskResult 1→0）
- 备份：双端 bundle + tag（详见 GBrain backup-ledger 页）

**测试**：build 全绿、线上三线实测（feed 1563 条、墨极 269 期、archive 9/26）。
**遗留**：见 KNOWN-ISSUES #1/#4。

## 2026-09-26 白天：用户反馈修复 + 遗留清零

**原因**：用户实测发现 li-news 的 /archive 与 /moji_daily 显示 8 月旧数据；随后授权清账遗留。

**代码（git）**：
- moji_daily/archive 冻结副本退役：删除 + _redirects 302 主站实时版；首页按钮直达攀攀.xyz；保留 8 月全录快照 ×7（全网唯一副本）（6c3d53f）
- feed 限 100 条（858KB→66KB）；PagedNewsList 分页（首屏 50）；other 入口隐藏+文案中性化；Sidebar RSS 真链接（3b95e4a）
- 数据单源化：6 个生成 TS 出 git + prebuild 重建；search 页 useMemo 重构；lint 0 error；eslint 豁免 scripts CJS（ef7aa45）

**服务器**：
- EXA key 轮换（新 key 入 env 实调验证）
- 死配置 /opt/hermes/cron/jobs.json 全部置 False；fallback 跳过日志落盘修正

**流程**：
- 邮件告警从零到全局化：/usr/local/bin/notify-email（QQ 邮箱 SMTP，15 分钟节流，标题格式 [项目][严重性] 首行提炼）——任何项目一行接入
- GBrain 接入文档：notify-email-global / backup-ledger（备份台账：每份备份登记时点与可删期限）
- GenMojiDaily 留档文件（moji_daily_YYYYMMDD.html）纳入每日提交清单

**测试**：20/20；CF 部署 success；线上安全头/feed/重定向逐一实测。
**遗留**：KNOWN-ISSUES #1-#6。

## 2026-09-26 晚：第三阶段主动巡检 + 清账

**原因**：转为主动维护模式，巡检结论 P0/P1 为零，授权清账候选任务 2-7。

**代码（git）**：
- fetch-news 输出 NEW_ITEMS_COUNT（静默降级观测，c70b3ae）
- _headers 基础安全头三件套；search 页 SearchBar 加 key 同步后退（17cee18）

**服务器**：
- daily-collection.sh v3：flock 并发锁 + 日志 5MB 轮转 + **fallback 语义修正**（只认"chore: 每日新闻更新"数据提交——实测时发现的真 bug：代码提交曾会让兜底误跳）+ 产出 <20 时 WARN 邮件（阈值实测标定：正常 34 / Exa 挂 15）
- 9/4 旧脚本备份删除（台账登记）

**流程**：
- 第三阶段巡检报告归档（候选 7 项：2 豁免/3,4,5,6 修复/7 登记）
- sharp 漏洞验证后豁免（ARCHITECTURE D8）

**测试**：双场景计数（34/15）、flock 双场景、轮转实测、WARN 邮件实发、20/20、lint 0 error。
**遗留**：KNOWN-ISSUES #1-#6 + #9（用户侧 Exa 后台作废旧 key）。

## 2026-09-26 深夜：第四阶段维护体系

**原因**：建立长期维护文档与机制。
**内容**：新增 ARCHITECTURE.md（决策记录 D1-D8+隐含依赖+重构方向）、KNOWN-ISSUES.md（9 项台账）、CHANGELOG.md（本文件）；README 修正 6 处落后项；package.json 补 test script（README 声称的 npm test 此前并不存在）。
**遗留**：无新增。
