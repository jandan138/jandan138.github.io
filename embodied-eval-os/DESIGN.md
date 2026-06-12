# EmbodiedEval OS 交互式教程 — 设计文档 (DESIGN)

> 一本"娓娓道来"的 HTML 书，帮读者**完全理解 EmbodiedEval OS 这个项目**。
> 受众：已读完 EBench 教程前五章（懂 VLA、Isaac Sim 仿真栈、benchmark 方法论、client–server 评测、flow matching）的读者。

## 0. 目标与约束
- **重心**：把 EOS 讲成「比 EBench 高一层的抽象」——一台 domain-agnostic、backend-composable 的评测 OS，EBench 在其中只是一个 adapter。既讲清三条铁律（不污染 core / adapter 防腐层 / 拆分 backend 组件）与两条纪律（trace 即证据 / claim boundary 必填），也讲清证据脊柱（EpisodeTrace + L0–L6）、运行时（RPF 八动词 + live model loop）、以及真实工程硬仗。
- **语言**：中文叙述；英文保留所有架构术语、命令名、类名、性能指标、概念名。
- **位置**：`learn/`（仓库内）。零构建，纯 HTML/CSS/JS，CDN 引 KaTeX。
- **三座桥**：引入新概念时用「从 EBench 看 / 从评测科学 看 / 从物理后端 看」连接读者已有知识。
- **资料**：先收集（仓库 docs/design + docs/records + 真实代码；外部 MetaSim/RoboVerse、Genesis、Newton、MuJoCo、PyBullet、AutoBio、sim2sim parity；评测科学 construct validity / reproducibility / world-model eval / model cards / HELM），再整合，不只靠领域知识。

## 1. 信息架构
9 个 Part + Appendix，共 38 节。导航单一真相源 = `content.js`（`window.EOSBOOK`）。
- P0 序章：why an eval OS / 仓库星座 / 怎么读·三座桥
- P1 三条铁律：证据高于能力面 / claim boundary / no silent fallback / 不污染 core
- P2 后端可组合：六大组件 / backend profile / 引擎众生相 / 能力账本
- P3 证据脊柱：L0–L6 / 三层状态 / EpisodeTrace / 为什么不是裸 TensorState
- P4 packs & adapters：pack contract / 适配器防腐层 / scientific_lab / wetlab_safety
- P5 度量与画像：metric family vs instance / 五条能力轴 / 模型家族 / 聚合陷阱
- P6 运行时：两条路径 / RPF 八动词 / live model loop / conformance & release
- P7 硬仗：状态迁移 qpos 坑 / WorldState Runtime / judgeable loop / faithful reproduction 清算
- P8 实战：跑通 smoke / 扩展 / PR 纪律
- Appendix：glossary / repo map / cheatsheet / references

## 2. 技术与文件组织
```
learn/
├── DESIGN.md / README.md / _AGENT_BRIEF.md / _template.html
├── index.html                 # 封面 + 总目录
├── content.js                 # 导航单一真相源 window.EOSBOOK
├── assets/css/book.css        # 设计系统（light/dark、三栏、组件、三座桥、claim、verdict）
├── assets/js/book.js          # 运行时（导航/主题/进度/scroll-spy/搜索/高亮/KaTeX/widget 自动挂载）
└── assets/js/widgets/         # registry.js + 14 个交互部件（data-widget 自动发现）
```

## 3. 设计系统要点
- CSS 变量主题（light/dark + localStorage）；衬线标题 + 无衬线正文 + 等宽代码 + Noto Sans SC 中文。
- 三栏：sticky topbar（进度条）/ 左侧 TOC 树 / 主阅读列(~740px) / 右侧 On this page。
- 签名组件：`.callout.claim`（claim boundary，琥珀金 ⚖）；三座桥 `.bridge.eb/.ev/.sm`；`.verdict` chips（matched/mismatched/blocked/neutral）；`.term` 英文术语高亮；`table.ledger` 能力矩阵。

## 4. 交互部件清单（14）
capability-radar（五轴雷达，0-1 & 5-2）/ core-placement（禁词归位，1-4）/ claim-ladder（claim levels，1-2）/ no-silent-fallback（1-3）/ backend-composer（六组件组合，2-1）/ capability-ledger（registry vs readiness，2-4）/ layer-stack（L0–L6，3-1）/ state-normalization（measure→project→semantics，3-2）/ trace-anatomy（EpisodeTrace 浏览，3-3）/ tensorstate-trap（同形状≠可比，3-4）/ rpf-verbs（八动词时序，6-2）/ qpos-remap（stage50 bug，7-1）/ divergence-trace（首次分叉，7-2）/ hazard-levels（0–5 + DDR/FNR，4-4）。

## 5. 相对 EBench/learn 的取舍
取其精华：零构建、widget 自动发现（`data-widget` + 注册表）、客户端搜索、IntersectionObserver 懒挂载、三栏布局、桥的隐喻。
去其糟粕 / 适配：换 EOS 配色与命名（`window.EOSBOOK`/`window.EOSWidgets`/`window.EOSW`）；新增 `.callout.claim` 与 `.verdict` 两个 EOS 专属组件；三座桥改为 EBench/评测科学/物理后端（受众已懂 EBench，桥的一端就是它）。
