# EmbodiedEval OS 交互式教程

一本"娓娓道来"的 HTML 书，帮你**完全理解 EmbodiedEval OS 这个项目** —— 一台 domain-agnostic、backend-composable 的具身智能评测 OS。从三条铁律（不污染 core / adapter 是防腐层 / 拆分 backend 组件）、证据脊柱（`EpisodeTrace` + L0–L6 分层），到运行时（Runtime Provider Facade 的八动词、live model loop）与它走过的硬仗（跨引擎 parity、judgeable loop、faithful-reproduction 的清算）。

**受众**：已读完 [EBench 教程](../../EBench/learn) 前五章的读者 —— 懂 VLA、Isaac Sim 仿真栈、benchmark 方法论、client–server 评测、flow matching。在这本书里，**EBench 只是 EOS 的一个 adapter**。

中文叙述，保留英文术语。

## 怎么看

零构建（zero-build），纯静态。任选其一：

```bash
# 方式一：本地静态服务器（推荐，KaTeX/字体走 CDN，需要联网）
cd learn && python3 -m http.server 8000
# 浏览器打开 http://localhost:8000/index.html

# 方式二：直接用浏览器打开 learn/index.html（file://）
```

入口是 `index.html`（封面 + 总目录）。`/` 或 <kbd>Ctrl/Cmd+K</kbd> 打开搜索；右上角切换深色/浅色。

## 结构

- `index.html` —— 封面与目录
- `content.js` —— 导航单一真相源（`window.EOSBOOK`，章节、上下页、搜索都由它驱动）
- `assets/css/book.css` —— 设计系统（主题、三栏布局、组件、三座桥、claim-boundary、verdict）
- `assets/js/book.js` —— 运行时（导航、主题、进度、搜索、代码高亮、KaTeX、widget 自动挂载）
- `assets/js/widgets/` —— 交互部件 + 注册表（`data-widget` 自动发现）
- `chapters/` —— 9 个 Part + Appendix，共 38 节
- `DESIGN.md` —— 设计文档；`_AGENT_BRIEF.md` —— 写作时用的事实库与风格规范；`_template.html` —— 新章节样板

## 三座桥

每当引入新概念，尽量用一座"桥"连接读者已有的知识：

- **从 EBench 看**（`bridge eb`）—— 接到 EBench 教程学过的东西。
- **从评测科学 看**（`bridge ev`）—— 接到 construct validity / reproducibility / model cards 等评测科学。
- **从物理后端 看**（`bridge sm`）—— 接到 Isaac/MuJoCo/Genesis/Newton 等真实物理引擎的现实。

> 全书贯穿 EOS 的签名纪律：**claim boundary**。凡讲"这证明了什么 / 不能证明什么"，都用 `.callout.claim`。`semantic proxy` 不是 real CFD；`compatibility smoke` 不是 full benchmark reproduction；`simulator-only hazard` 不是 real-world safety。
