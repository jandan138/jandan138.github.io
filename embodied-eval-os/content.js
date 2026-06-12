/*
 * content.js — 导航单一真相源 (single source of truth)
 * 驱动：左侧 TOC 树、上下页导航、封面目录、客户端搜索。
 * 每个 section: { id, title, file, keywords }
 * file 路径相对于 learn/ 根目录。
 */
window.EOSBOOK = {
  title: "EmbodiedEval OS",
  subtitle: "一本娓娓道来的交互式教程",
  parts: [
    {
      id: "p0", label: "Part 0", title: "序章 · Orientation",
      sections: [
        { id: "0-1", title: "从一个 benchmark 到一台 evaluation OS", file: "chapters/00-orientation/0-1-why-eos.html",
          keywords: "why eos evaluation os benchmark ebench domain agnostic five axes 评测操作系统 愿景" },
        { id: "0-2", title: "仓库星座：core / packs / adapters / backends", file: "chapters/00-orientation/0-2-constellation.html",
          keywords: "constellation repo map core scenario packs adapters backends configs runtime 目录 结构" },
        { id: "0-3", title: "怎么读这本书 · 三座桥", file: "chapters/00-orientation/0-3-how-to-read.html",
          keywords: "how to read bridge ebench eval science physics backend 受众 阅读指南 三座桥" },
      ],
    },
    {
      id: "p1", label: "Part 1", title: "三条铁律 · The Big Ideas",
      sections: [
        { id: "1-1", title: "证据高于能力面：trace 即产品边界", file: "chapters/01-foundations/1-1-evidence.html",
          keywords: "evidence over surface trace product boundary sdk call success 证据 调用后端 不等于 结论" },
        { id: "1-2", title: "Claim boundary：永不过度宣称", file: "chapters/01-foundations/1-2-claim-boundary.html",
          keywords: "claim boundary overclaiming forbidden claim catalog semantic proxy cfd 过度宣称 边界" },
        { id: "1-3", title: "No silent fallback：缺证据就是 blocked", file: "chapters/01-foundations/1-3-no-silent-fallback.html",
          keywords: "no silent fallback blocked missing measurement zeros default pass denominators 缺证据 静默回退" },
        { id: "1-4", title: "不污染 core：契约 vs 领域语义", file: "chapters/01-foundations/1-4-core-boundaries.html",
          keywords: "core boundaries pollution forbidden names anti corruption layer core entry test 三层 契约 领域语义" },
      ],
    },
    {
      id: "p2", label: "Part 2", title: "后端可组合 · Backend Composability",
      sections: [
        { id: "2-1", title: "一个后端不是一个字符串：六大组件", file: "chapters/02-backends/2-1-six-components.html",
          keywords: "backend composability six components platform physics renderer sensors control process runtime 六组件 组合" },
        { id: "2-2", title: "Backend profile 与 capability tier", file: "chapters/02-backends/2-2-backend-profile.html",
          keywords: "backend profile component profile capability tier native reduced semantic proxy yaml 配置" },
        { id: "2-3", title: "引擎众生相：Isaac / MuJoCo / Genesis / PyBullet / Newton", file: "chapters/02-backends/2-3-engines.html",
          keywords: "isaac sim physx rtx mujoco mjx genesis pybullet newton warp 物理引擎 渲染" },
        { id: "2-4", title: "能力矩阵是账本，不是分数", file: "chapters/02-backends/2-4-capability-ledger.html",
          keywords: "capability matrix ledger registry readiness exact approximate partial blocked one component 账本 就绪" },
      ],
    },
    {
      id: "p3", label: "Part 3", title: "证据脊柱 · Trace & State",
      sections: [
        { id: "3-1", title: "L0–L6 分层：从资源到证据账本", file: "chapters/03-trace-state/3-1-layers.html",
          keywords: "l0 l6 layering resource worldspec worldsession measurement projection semantics evidence ledger 分层" },
        { id: "3-2", title: "三层状态：measure → project → semantics", file: "chapters/03-trace-state/3-2-state-layers.html",
          keywords: "runtime measurement snapshot physical state projection task semantic state normalize 三层状态 归一化" },
        { id: "3-3", title: "EpisodeTrace 解剖", file: "chapters/03-trace-state/3-3-episode-trace.html",
          keywords: "episode trace tracestep versions claim boundary privileged state policy state v2 证据 脊柱 解剖" },
        { id: "3-4", title: "为什么不是一个裸 TensorState", file: "chapters/03-trace-state/3-4-tensorstate.html",
          keywords: "tensorstate metasim same shape comparable joint ordering gym wrapper 裸张量 对比" },
      ],
    },
    {
      id: "p4", label: "Part 4", title: "场景包与适配器 · Packs & Adapters",
      sections: [
        { id: "4-1", title: "Scenario pack contract", file: "chapters/04-packs-adapters/4-1-pack-contract.html",
          keywords: "scenario pack contract taskspec process primitive directory structure 场景包 契约" },
        { id: "4-2", title: "适配器即防腐层：EBench / AutoBio", file: "chapters/04-packs-adapters/4-2-adapters.html",
          keywords: "adapter anti corruption ebench autobio faithful semantic reproduction legacy backend profile 适配器 防腐" },
        { id: "4-3", title: "scientific_lab：把禁词关进笼子", file: "chapters/04-packs-adapters/4-3-scientific-lab.html",
          keywords: "scientific lab pack pipette threaded cap proxy force families finger cap contact 实验室 禁词" },
        { id: "4-4", title: "wetlab_safety：危险感知的世界模型评测", file: "chapters/04-packs-adapters/4-4-wetlab-safety.html",
          keywords: "wetlab safety hazard levels world model ddr fnr negative samples 危险 安全 世界模型" },
      ],
    },
    {
      id: "p5", label: "Part 5", title: "度量与画像 · Metrics & Reports",
      sections: [
        { id: "5-1", title: "Metric family（core）vs metric instance（pack）", file: "chapters/05-metrics-reports/5-1-metric-families.html",
          keywords: "metric family task outcome procedure precision hazard prediction planning resource metricspec 度量家族 实例" },
        { id: "5-2", title: "五条能力轴与 CapabilityProfile", file: "chapters/05-metrics-reports/5-2-capability-profile.html",
          keywords: "five capability axes task execution world prediction safety generalization planning capability profile no single scalar 能力画像" },
        { id: "5-3", title: "模型家族与可见性模式", file: "chapters/05-metrics-reports/5-3-model-families.html",
          keywords: "model families actor world model planner safety critic agent standard privileged oracle eval visibility 模型家族 可见性" },
        { id: "5-4", title: "度量的 claim boundary 与聚合陷阱", file: "chapters/05-metrics-reports/5-4-metric-boundaries.html",
          keywords: "metric claim boundary aggregation simpson paradox single scalar denominators 聚合 陷阱 边界" },
      ],
    },
    {
      id: "p6", label: "Part 6", title: "运行时 · Runtime",
      sections: [
        { id: "6-1", title: "两条评测路径：EpisodeRunner vs provider loop", file: "chapters/06-runtime/6-1-two-paths.html",
          keywords: "episode runner provider loop in process evidence chain backend model protocol 两条路径 运行时" },
        { id: "6-2", title: "Runtime Provider Facade：八个动词", file: "chapters/06-runtime/6-2-rpf.html",
          keywords: "runtime provider facade rpf eight verbs materialize reset apply state control step measure query close metasim 八动词" },
        { id: "6-3", title: "Live model loop：观测 → 动作 → 证据", file: "chapters/06-runtime/6-3-live-loop.html",
          keywords: "live model loop observation action control measure project evaluate trace model visible redaction rpf10 evl1 实时 闭环" },
        { id: "6-4", title: "Conformance、就绪与 release claim levels", file: "chapters/06-runtime/6-4-conformance-release.html",
          keywords: "provider conformance kit readiness release claim levels gate fixture driven 一致性 就绪 发布" },
      ],
    },
    {
      id: "p7", label: "Part 7", title: "走过的硬仗 · The Hard Problems",
      sections: [
        { id: "7-1", title: "跨引擎状态迁移：qpos 拷贝的坑", file: "chapters/07-hard-problems/7-1-state-transfer.html",
          keywords: "cross engine state transfer qpos copy stage50 semantic component map joint name remap interpenetration 状态迁移" },
        { id: "7-2", title: "WorldState Runtime：从同起点到首次分叉", file: "chapters/07-hard-problems/7-2-worldstate-runtime.html",
          keywords: "worldstate runtime wr paired dynamic trace first divergence raw vs assisted lane 同起点 分叉" },
        { id: "7-3", title: "Judgeable loop：把分叉记成账", file: "chapters/07-hard-problems/7-3-judgeable-loop.html",
          keywords: "judgeable loop fairness gate matched mismatched blocked accounted non equivalence force law r15 可判定 账本" },
        { id: "7-4", title: "「Faithful reproduction」的清算", file: "chapters/07-hard-problems/7-4-faithful-reproduction.html",
          keywords: "faithful reproduction not approved demote benchmark regression scenario name the claim stage thrash 忠实复现 清算" },
      ],
    },
    {
      id: "p8", label: "Part 8", title: "实战 · Capstone",
      sections: [
        { id: "8-1", title: "跑通 smoke，读一条 trace", file: "chapters/08-capstone/8-1-run-smoke.html",
          keywords: "run smoke episode runner semantic proxy random policy task outcome trace store json 实战 跑通" },
        { id: "8-2", title: "写一个最小 scenario pack + model adapter", file: "chapters/08-capstone/8-2-extend.html",
          keywords: "minimal scenario pack model adapter taskspec scenespec process primitive evaluator 扩展 自定义" },
        { id: "8-3", title: "PR 纪律：让项目对自己诚实", file: "chapters/08-capstone/8-3-pr-discipline.html",
          keywords: "pr discipline required commands record rule claim boundary check leakage gate honest 纪律 诚实" },
      ],
    },
    {
      id: "pa", label: "Appendix", title: "附录 · Reference",
      sections: [
        { id: "a-1", title: "术语表 Glossary", file: "chapters/appendix/a-1-glossary.html",
          keywords: "glossary terms 术语表 词汇 eos l0 l6 rpf wr erf evl" },
        { id: "a-2", title: "仓库与文件地图", file: "chapters/appendix/a-2-repo-map.html",
          keywords: "repo map file tree core scenario packs adapters configs scripts tests 仓库 文件 地图" },
        { id: "a-3", title: "速查：六组件 / 八动词 / claim levels / 禁词", file: "chapters/appendix/a-3-cheatsheet.html",
          keywords: "cheatsheet six components eight verbs claim levels forbidden names metric families 速查表" },
        { id: "a-4", title: "参考文献 References", file: "chapters/appendix/a-4-references.html",
          keywords: "references papers arxiv metasim roboverse genesis newton mujoco autobio 参考文献 论文" },
      ],
    },
  ],
};

/* 扁平化：供上下页导航与搜索使用 */
window.EOSBOOK.flat = (function () {
  const out = [];
  window.EOSBOOK.parts.forEach((p) => {
    p.sections.forEach((s) => out.push(Object.assign({ part: p.title, partLabel: p.label }, s)));
  });
  return out;
})();
