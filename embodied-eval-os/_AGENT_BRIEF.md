# 章节写作 BRIEF（给章节写作 agent）—— EmbodiedEval OS 教程

你在为 **EmbodiedEval OS（简称 EOS）交互式教程**写章节 HTML。先 Read 两个样板：
- 黄金参考：`chapters/00-orientation/0-1-why-eos.html`（**严格模仿它的结构、语气、HTML 用法**）
- 骨架模板：`_template.html`
- 导航源（含所有章节 id/title/file/上下页顺序）：`content.js`

## 受众与语气
- 读者**已经读完 EBench 教程的前五章**：懂 VLA（VLM backbone + action）、仿真栈（Isaac Sim = USD+PhysX+RTX、cuRobo、GenManip、LeRobot）、benchmark 方法论（capability profile、tracks/splits、tasks/scoring、generalization）、client–server 评测引擎、以及 VLA 理论（action chunking、flow matching、rectified flow）。**不要重复教这些**；要把它们当作读者的「家」，从那里出发。
- EOS 不是又一个 benchmark，而是**比 EBench 高一层的抽象**：一台 domain-agnostic、backend-composable 的具身智能评测 OS。**EBench 在 EOS 里只是一个 adapter。** 这是全书的核心叙事。
- 中文叙述，**娓娓道来**、有「为什么」，不流水账。**英文保留所有架构术语、命令名、类名、性能指标、概念名**（符合论文阅读习惯）。
- 每节开头一句 `<p class="lede">` 导言；结尾用一个 `<h2 id="...">` 小结收束并预告下一节。
- 目标：每节 ~900–1600 字中文正文 + 合适的代码/公式/callout/桥/（指定的）widget。

## HTML 规则（务必遵守）
1. 每个文件是完整 HTML，**完整复制黄金参考的 `<head>`、topbar、layout、search-overlay、底部 script 块**，只改：`<title>`、`data-section="X-Y"`、`.eyebrow`（`Part X · 名称 · X-Y`）、`<h1>`、`<p class="lede">`、正文。
2. `data-root="../../"` 对所有 `chapters/<dir>/*.html` 都适用（两级深度）。
3. **不要手写 prev/next 和侧栏**——`book.js` 用 `content.js` 自动生成。`<nav id="sidebar">`、`<aside id="rail">` 留空。
4. **每个 `<h2>`/`<h3>` 必须带唯一 `id`**（右栏 "On this page" 与 scroll-spy 依赖）。
5. 术语高亮：`<span class="term">EpisodeTrace</span>` 高亮英文术语/命令/类名；`<span class="term-i">italic</span>` 强调中文。
6. 代码块：
   ```html
   <div class="code" data-lang="python"><div class="code-h"><span class="fn">src/embodied_eval_os/core/state/trace.py</span><button class="cp">复制</button></div><pre><code>...原样代码...</code></pre></div>
   ```
   `data-lang` ∈ `python`/`bash`/`yaml`/`json`/`text`。`<code>` 内只做 `&lt; &gt; &amp;` 转义（高亮由 book.js 做）。
7. 数学：行内 `$...$`，行间 `<div class="math-block">$$...$$</div>`（KaTeX）。直觉 + 关键公式，不堆代数。
8. callout：`<div class="callout note">`（提示）/`<div class="callout warn">`（坑/过度宣称）/`<div class="callout claim">`（**claim boundary —— EOS 签名组件，凡是讲"这证明了什么 / 不能证明什么"都用它**）/`<div class="callout">`（中性）。内部 `<div class="c-h">标题</div>` + `<p>`。
9. **三座桥**（引入新概念时尽量用，连接读者已有知识）：
   - `<div class="bridge eb"><div class="c-h"><span class="tag">从 EBench 看</span> 标题</div><p>…</p></div>` —— 连接 EBench 教程学到的东西。
   - `<div class="bridge ev"><div class="c-h"><span class="tag">从评测科学 看</span> 标题</div><p>…</p></div>` —— 连接评测科学（construct validity、reproducibility、model cards…）。
   - `<div class="bridge sm"><div class="c-h"><span class="tag">从物理后端 看</span> 标题</div><p>…</p></div>` —— 连接真实物理引擎/sim 的现实。
10. verdict chip：`<span class="verdict matched">matched</span>` / `mismatched` / `blocked` / `neutral`。
11. 交叉引用用相对链接，例如 `<a href="../03-trace-state/3-3-episode-trace.html">3.3</a>`（按 content.js 的 file 路径）。

## 交互部件（widget）
所有部件脚本已在底部 script 块加载。嵌入方式：
```html
<div class="lab">
  <div class="lab-h"><span class="lab-tag">interactive</span><span class="lab-t">标题</span></div>
  <div class="lab-body" data-widget="WIDGET_NAME"></div>
  <div class="lab-cap">一句说明怎么玩 / 看什么。</div>
</div>
```
可用 `WIDGET_NAME`（每个**全书只在指定的那一节用一次**，不要滥用）：
- `capability-radar` —— 五条能力轴雷达；**0-1 用过一次**，5-2 可再用一次换角度。
- `core-placement` —— 把概念拖进 core/pack/adapter，leakage checker 标红禁词。用于 **1-4**。
- `claim-ladder` —— release claim levels 阶梯（contract→fixture→live SDK→evaluator→suite→release gate）。用于 **1-2**（6-4 点到为止）。
- `no-silent-fallback` —— 缺测量时「填 0/success=true」vs「blocked_*」。用于 **1-3**。
- `backend-composer` —— 组合六大组件 → profile + 它能/不能支持的对比实验。用于 **2-1**。
- `capability-ledger` —— 能力/就绪矩阵的 axis-status（exact/approximate/.../blocked），registry vs readiness。用于 **2-4**。
- `layer-stack` —— L0–L6 分层探索器。用于 **3-1**。
- `state-normalization` —— measure→project→semantics 三层；qpos 向量 → projection → finger_cap_contact。用于 **3-2**。
- `trace-anatomy` —— 交互式浏览一条 EpisodeTrace JSON，高亮 claim_boundary / privileged。用于 **3-3**。
- `tensorstate-trap` —— 同形状 tensor、不同 joint ordering，为什么不可比。用于 **3-4**。
- `rpf-verbs` —— 八动词 facade 时序驱动一个 episode + model-visible 脱敏。用于 **6-2** 或 **6-3**。
- `qpos-remap` —— stage50 bug：按 index 拷贝 vs 按 joint name 重映射。用于 **7-1**。
- `divergence-trace` —— paired dynamic trace 拖时间轴看 first divergence、各轴 verdict。用于 **7-2** 或 **7-3**。
- `hazard-levels` —— 0–5 危险等级 + 世界模型预测 vs 真值（DDR/FNR）。用于 **4-4**。

---

# 事实库（FACTS）—— 只用这里 + 你 Read 到的真实代码/文档，不要臆造数字或类名

仓库根：`/cpfs/user/zhuzihou/dev/embodied-eval-os`。需要核对时去 Read 真实文件（`src/embodied_eval_os/...`、`docs/design/*.md`、`configs/backend_profiles/*.yaml`、`examples/run_smoke.py`、`scripts/check_core_leakage.py`、`docs/records/*.md`）。

## 0. 一句话定位（全书反复出现，可直接引用）
- EOS 是 **“a domain-agnostic, backend-composable evaluation OS for embodied intelligence”**。
- 招牌对照句：**“MetaSim solves cross-simulator execution ergonomics; EOS solves evidence-backed embodied evaluation claims.”**
- 它**不是**：an EBench fork；a GenManip wrapper；an Isaac-only benchmark；a scientific-lab-only benchmark；a VLA-only evaluation harness。Scientific-lab、wet-lab safety、home manipulation、factory assembly、field robotics、warehouse、real robots 都是 **scenario packs 或 adapters**。
- 核心论点（vs 普通 benchmark）：差异是**证据**，不是能力面。“成功调用一个后端 SDK 不等于评测结论成立。” “The trace design is the product boundary.” “It should not compete on simulator handler count or support-matrix breadth.”

## 1. 五条能力轴（README §0）
1. **task execution**（任务执行）2. **world prediction / WAM / WM**（世界模型未来预测）3. **safety reasoning**（危险预测、边界识别、拒绝危险动作）4. **generalization**（跨物体/场景/后端/渲染/本体）5. **planning usefulness**（世界模型是否真能帮助规划与安全决策）。

## 2. 三条铁律（Hard Rules）
**铁律一：不污染 core。** `src/embodied_eval_os/core/` 必须 domain-agnostic。
- 禁词（core-boundaries.md §3 权威超集，35+）：`EBench GenManip Lift2 Isaac41 IsaacSim AutoBio R5A MJCF MuJoCo OpenPI RDT EvalClient Lab WetLab Pipette Centrifuge TubeRack Contamination PCRPlate VortexMixer RobotRuntime EmbodimentRuntime RobotState EmbodimentState CanonicalRobotState UniversalController ControlStack HardwareReady SafeRobot URDF SAPIEN PhysX qpos qvel`。还禁 benchmark 专属 `Expert` 类。
- 实际 `scripts/check_core_leakage.py` 扫描 `core/**/*.py`，禁的 token（小写子串/词边界）含：`ebench genmanip lift2 isaac41 isaac_sim autobio r5a mjcf mujoco openpi rdt evalclient lab wet_lab pipette centrifuge tube_rack contamination pcr_plate vortex_mixer`。**比文档 CLAUDE.md 的短表更严**。
- **Core Entry Test**：一个概念能进 core，仅当它对以下至少一项有用：≥2 个 scenario packs / ≥2 个 backend profiles / ≥2 个 model families / 今天 1 个场景 + 文档化的第二个路线图场景。否则留在 pack/adapter。
- 三层放置：**core**=场景中立的**契约**（contracts），不是领域语义；**scenario_packs/**=场景语义（pipette、hazard taxonomy…）；**adapters/**=被导入 benchmark 的概念（anti-corruption layer）。
- 依赖方向：`core ← scenario_packs / adapters / backends / model_adapters`，**绝不反向**。core 不得 import 这些。
- 允许进 core 的概念（§2）：`TaskSpec SceneSpec SemanticAsset EmbodimentSpec ObservationSpec ActionSpec MetricSpec BackendProfile ModelProfile ReferencePolicyProfile DemonstrationSourceProfile InteractionPrimitive ProcessPrimitive DevicePrimitive MaterialPrimitive PhysicalStateProjection TaskSemanticState PredictedFuture EpisodeTrace Evaluator Recorder ReportGenerator`。

**铁律二：adapter 是防腐层（anti-corruption layer）。** EBench/GenManip/AutoBio/Isaac 4.1 只能经 adapter 接入，不得反塑 core API。
- 允许：`adapters/ebench/`、`adapters/autobio/`、`configs/backend_profiles/ebench_genmanip_legacy.yaml`。
- 不允许：`core.GenManipRuntime`、`core.Lift2Action`、`core.EBenchScore`。
- 一句口径：外部 sim 抽象框架（含 MetaSim）**do not weaken this rule**。

**铁律三：拆分 backend 组件。** 不许把后端只描述成 `Isaac`/`MuJoCo`/`Genesis`。永远记录六个组件（见 §4）。

另有两条贯穿性纪律：
- **铁律四：trace 是证据。** 每个非平凡评测都要产出或定义到 `EpisodeTrace` 的路径。没有 trace 元数据的结果不是强证据。
- **铁律五：claim boundary 必填。** 不许过度宣称。`semantic proxy` ≠ real CFD；`compatibility smoke` ≠ full benchmark reproduction；`simulator-only hazard` ≠ real-world safety certification；`EBench score` ≠ scientific-lab capability。

## 3. No Silent Fallback Policy（缺证据就 blocked，不许填 0）
缺证据要变成显式状态：`blocked_missing_measurement / blocked_missing_state / blocked_missing_artifact / blocked_invalid_action / blocked_control_rejected / blocked_provider_unavailable / blocked_optional_dependency / unsupported / not_evaluated`。
**绝不**变成 `0.0 / [] / {} / success=true / score=1.0 / default pass / 隐式实跑`。报告必须带**分母**与逐轴状态：`runtime_execution_rate model_action_valid_rate control_acceptance_rate projection_ready_rate evaluator_pass_rate render_capture_rate artifact_linkage_failures blocked_* counts`。由 `scripts/check_architecture_debt.py`、`scripts/check_required_live_lanes.py` 执行。

## 4. 六大 backend 组件（backend-composability.md）
| 组件 | 定义（原文） | 例子 |
|---|---|---|
| **platform** | the integration environment or simulator shell | Isaac Sim; MuJoCo; Genesis; custom split backend; real robot runtime |
| **physics** | the source of physical transition dynamics | PhysX; Newton; MuJoCo physics; Genesis physics; real world; reduced semantic physics |
| **renderer** | the source of image-like observations | Isaac RTX; Blender Cycles; MuJoCo renderer; Genesis renderer; real camera; offline rerenderer |
| **sensors** | the source of sensor readings | RGB; depth; segmentation; force/torque; tactile; proprioception; instrument logs |
| **control** | the execution interface for actions | joint action; ee-delta; action chunk; skill command; ROS control; articulation controller |
| **process runtime** | the source of scenario-specific semantic state transitions | reduced liquid model; device state machine; hazard event generator; lab pipette primitive; conveyor; terrain transition |
- **为什么拆**：可以「同 rollout 换 renderer / 同 task 换 physics / 同 task 换 embodiment / 同 trace 换 evaluator / 同 scene 换 sensor noise」，从而分离 visual vs dynamics generalization、simulator artifact vs model ability、renderer-dependent vs physics-dependent failure。
- 跨后端实验必须**只改一个组件**并讲清：不要说「Compare Isaac vs MuJoCo」，要说「Compare PhysX vs MuJoCo physics while keeping task spec and metric spec fixed」。
- **capability tier**（代码 `core/specs/backend_profile.py` 的 `CapabilityTier`）：`NATIVE REDUCED SEMANTIC_PROXY EMULATED UNSUPPORTED`。
- **axis-level status**（账本用）：`exact approximate partial read_only write_only opaque_only unsupported blocked`。
- 两层：**runtime capability registry**（静态声明打算支持什么）vs **backend readiness ledger**（这一次实际测到/产出/被 block/失败什么）。账本不是分数：“A simulator support matrix … does not imply task success, backend equivalence, trajectory parity, contact-force parity, render parity, sensor calibration, official benchmark reproduction, or real-world safety.”
- **BackendProfile** 代码：`@dataclass(frozen=True)` 含 `profile_id, platform, physics, renderer, control, process_runtime: ComponentProfile|None, sensors: list[ComponentProfile]`，方法 `component_summary()`。`ComponentProfile`：`name, component_type, version, capabilities: dict, metadata`。
- profile YAML 顶层 key：`profile_id, platform, physics, renderer, sensors(列表), control, process_runtime, metadata`。代表性最小 profile = `configs/backend_profiles/dummy_backend.yaml`。富例：`mujoco_autobio.yaml`（physics.name mujoco version 3.3.0、interaction_dynamics 表多为 blocked、metadata 含 external_benchmark/anti_corruption_layer/limitations）、`ebench_genmanip_legacy.yaml`、`genesis_native.yaml`、`isaac_physx_rtx.yaml`、`isaac_newton_experimental.yaml`。

## 5. L0–L6 分层 + 三层状态（trace-and-state.md / architecture.md）
- L0 Resource/Asset → L1 EvaluationWorldSpec → **L2 WorldSession**（live runtime 的 session 信封；含 lifecycle、clock、domain channels、control、sensors、native artifact refs、capability 声明；“USD-covering, not USD-shaped”；在 `src/embodied_eval_os/runtime/`，**不在 core**；不是 USD clone，不是 per-step state 的拥有者）→ **L3 RuntimeMeasurementSnapshot**（measured/exported 的跨后端证据边界；immutable、artifact-backed、capability-scoped；**不保证完整/可恢复/可独立比较**）→ **L4 PhysicalStateProjection / CanonicalProjection**（backend-normalized、simulator-neutral 物理投影；典型字段 `time_s, robots{qpos,qvel,ee_pose}, objects{name:{pose,velocity}}, joints{name:{q,qd}}, contacts[{body_a,body_b,normal_force}]` —— 注意 qpos/qvel 在这里是**投影字段值**，不是 core API 名）→ **L5 TaskSemanticState**（场景拥有的语义/过程状态：process/procedure/hazard/evaluator 字段；core 不知道场景字段名，只存 schema-validated payload）→ **L6 Evidence Ledger / EpisodeTrace**。
- 三步归一化：L3（raw/measured，artifact 里可带 backend-native alias）→ L4（simulator-neutral 归一化）→ L5（场景语义）。
- **State V2 改名**（active API 用 V2；V1 仅经 `tools/migrations/state_v1/` 读）：`CanonicalPhysicalState→PhysicalStateProjection`、`TaskWorldState→TaskSemanticState`、`canonical_physical_state→physical_state_projection`、`task_world_state→task_semantic_state`、`world_state/metrics alias` 从主 API 删除、`get_canonical_state()→measure()+project_physical_state(...)`。代码里 `TraceStep.from_dict` 会**拒绝**这些 legacy key 并报错指向迁移模块。

## 6. EpisodeTrace（代码 `core/state/trace.py`）
`@dataclass EpisodeTrace`：`episode_id, task_id, scenario_pack, backend_profile_id, physics_profile_id, renderer_profile_id, seed, model_profile_id, versions: dict, backend_components: dict(platform/physics/renderer/sensors/control/process_runtime), privileged_state_policy="model_input_excludes_privileged_state", claim_boundary="Trace evidence only; no simulator fidelity or real-world safety claim.", steps: list[TraceStep], episode_metrics: dict, metadata: dict`；方法 `append/to_dict/from_dict`。
`TraceStep`：`step_index, time_s, observation, action, physical_state_projection, task_semantic_state, prediction, metric_results, privileged_state_visible_to_model=False, metadata`。
- `core/state/world_state.py`：`PhysicalStateProjection(time_s, objects, robots, joints, contacts, metadata)`、`TaskSemanticState(process_state, hazard_events, procedure_state, metadata)`（禁止内嵌 physical_state_projection）、`PredictedFuture(horizon_s, predicted_task_semantic_states, predicted_physical_state_projections, predicted_observations, success_probability, risk_scores, metadata)`。
- **Privileged State Rule**：默认 model 输入**不含** privileged state；evaluator/recorder 可含；state-conditioned benchmark 必须显式标注。
- **Versioning**：每条 trace 记 repo commit、scenario pack version、task spec version、backend profile version、asset manifest version、model checkpoint hash、seed、determinism env vars。“Without this metadata, the trace is not considered valid evidence.”
- **为什么不用裸 TensorState**：同 shape 的 tensor 不能证明 identical component inventories / joint-body-actuator-contact ordering / comparable frames-units-sign-force families / writable velocity-solver state / state-transfer success / trajectory parity / task success。Gym 式 `obs→action→reward→done` 只是 adapter 便利。

## 7. Evaluator / Metric（代码 `core/evaluators/base.py`、metric-system.md）
- `MetricResult(name, value, family, unit=None, details={})`；`EpisodeResult(episode_id, task_id, metrics: list[MetricResult], summary={})`；`Evaluator(ABC)` 有 `evaluator_id`、`evaluate_step(state, **kw)->list[MetricResult]`、`@abstractmethod evaluate_episode(trace)->EpisodeResult`。具体：`TaskOutcomeEvaluator`、`HazardEvaluator`（聚合 hazard_events、`max_hazard_severity`）、`PredictionEvaluator`。
- **核定义 metric family，pack 实例化 metric。** family 列表（文档略有不一致，照实写）：`task_outcome procedure state_transition precision hazard prediction planning resource`，外加 `restoration`（仅 metric-system.md）与 `generalization`（README/scenario/reporting）。family 是抽象的，不许提 pipetting/contamination/conveyor。
- `MetricSpec` 字段：`metric_id, name, family, scenario_pack, description, unit, range, target_direction(higher_is_better|lower_is_better|target_value), uses_privileged_state, supported_model_families, required_trace_fields, failure_modes`。
- 实例例子：scientific_lab `liquid_volume_error_ul`(precision, microliter, privileged)；wetlab `dangerous_action_detection_rate`=DDR(hazard)；factory `part_alignment_error_mm`(precision)；field `rollover_risk_detection_rate`(hazard)。
- 报告类型 **CapabilityProfile**（多轴分解：task outcome / procedure validity / precision / hazard-safety / prediction / planning usefulness / generalization / resource cost）。避免单标量。
- 度量 claim boundary：semantic liquid proxy metric ≠ real fluid dynamics；simulator-only hazard metric ≠ real-world safety；EBench-compatible success ≠ scientific-lab capability；cross-render robustness ≠ cross-physics robustness。

## 8. 模型家族与可见性
- model families：`actor_policy / vla / action_chunker / world_model(WAM) / planner / safety_critic / autonomous_agent`。
- policy roles：`evaluated_model / reference_policy / oracle_policy / scripted_demonstrator / human_demonstrator / safety_supervisor`。
- `ModelAdapter` 方法：`reset, act, predict_future, rank_plans, assess_safety`。`model_adapters/` 现有：`random_policy.py, scripted_policy.py, http_policy.py`（HTTPPolicyAdapter = 真模型 sidecar 路径）。
- eval 模式：`standard_eval / privileged_eval / oracle_eval`。`standard_model_score` 默认 **null**，仅当 evaluated_model + standard_eval + 正式协议 + 无 privileged state + forbidden-claim 检查通过 才非空。
- AutoBio `Expert`（privileged scripted demo）**不得**进 core；core 用通用 `ReferencePolicyProfile/DemonstrationSourceProfile`。

## 9. scenario pack contract（scenario-pack-contract.md）
- pack 定义 domain-specific tasks/assets/process primitives/metrics/protocols，**不改 core 抽象**。
- 目录：`README.md, tasks/<id>.yaml, scenes/<id>.yaml, assets/asset_manifest.yaml, embodiment_maps/semantic_component_map.yaml, metrics/metric_spec.yaml, process_primitives/README.md, samplers/sampler_spec.yaml, baselines/baseline_profiles.yaml, records/`。
- **代码现实（重要）**：仓库里**没有抽象 `ScenarioPack` 基类**。pack 契约靠 (a) subclass `core.primitives.*` 三个 ABC（`InteractionPrimitive/ProcessPrimitive/DevicePrimitive`，各有 `update(physical_state)->dict`）、(b) 消费 `PhysicalStateProjection`、(c) 产出落进 `TaskSemanticState` 的 dict + 自由函数实现。现有 packs：`scenario_packs/visual_manipulation_micro/`（EVL-1 视觉 lane，`build_visual_push_slide_scenario`、`evaluate_progress`）与 `scenario_packs/scientific_lab/`（`process_primitives/pipette_process.py` 里 `PipetteLiquidMaterialPrimitive(ProcessPrimitive)` 等，全标 `fidelity_tier="semantic_process_proxy", model_visible=False, privileged_state_label="evaluator_only"`）。
- TaskSpec 要求：`task_id, scenario_pack, instruction_templates, initial_state_distribution, observation_spec, action_spec, success_conditions, failure_conditions, metric_specs, allowed_backend_profiles, privileged_state_policy: evaluator_only`。
- 例子 packs（first batch）：`home_manipulation`(EBench-compatible)、`scientific_lab`、`wetlab_safety`(WWSB)、`factory_assembly`、`field_robotics`。

## 10. scientific_lab pack（scientific-lab-pack.md）
- 层级：`atomic physical abilities → scientific operation skills → long-horizon scientific tasks`。
- **Non-goals**：high-fidelity CFD；real chemical reaction sim；true microfluidics；real thermal fracture；real-world safety certification；full AutoBio faithful reproduction inside Isaac。
- 前三任务：pick/place tube；unscrew cap；pipette aspiration/dispense proxy。
- pack-local 原语：`PipetteProxyPrimitive, LiquidVolumeProxyPrimitive, ThreadedCapProxyPrimitive, RackSlotPrimitive, InstrumentStatePrimitive`。
- 度量实例：`sample_transfer_success`(task_outcome), `liquid_volume_error_ul`(precision), `protocol_step_validity`(procedure), `spillage_proxy_rate`(hazard), `future_liquid_state_error`(prediction)。
- 任务投影名（pack 拥有）：`finger_cap_contact, finger_cap_contact_force, gripper_aperture_response, tube_cap_body_retention, thread_retention_support`。
- **力家族必须分开**：`finger_cap_contact_force`(native 接触求解力) / `retention_constraint_force`(primitive/equality/weld 保持力) / `mujoco_thread_contact_force`(MuJoCo 源螺纹/接触保持力)。缺力向量 = blocker/coverage limit，**不是 false negative，不许填 0**。
- 反例（错）：`core.PipettePrimitive`/`core.ContaminationMetric`/`core.TubeRackSlot`；对：`scenario_packs/scientific_lab/process_primitives/pipette_proxy.py`。

## 11. wetlab_safety pack / WWSB（wetlab-safety-pack.md）
- 核心问题：“Can a world model predict unsafe state transitions before damage happens, and can it generalize to unseen hazard combinations?”
- 样本**负样本 ≥60%**（intentionally negative-heavy）。
- **hazard levels 0–5**：L0 标准成功；L1 可逆小错；L2 可逆显著错；L3 不可逆局部损伤；L4 系统性连锁危险；L5 灾难性事故（仅仿真或严格受控 proxy）。core 只知通用 hazard severity scale。
- 度量→core family：DDR(hazard, dangerous action detection rate)、FNR-H(hazard, dangerous false negative rate)、SMA(hazard/prediction, safety boundary prediction accuracy)、STE(prediction, state transition error)、DCS(prediction, dynamic consistency score)、NHG(generalization/hazard, unseen hazard combo)。
- 安全数据规则：**不采真实危险数据**；允许 safe real proxy / instrumented proxy / simulation-only hazardous / abstract hazard traces；未经外部安全评审禁止 real hazardous chemical release / pressure / explosive / aerosol。
- 第一里程碑 = schema closure（taxonomy + abstract hazard trace schema + DDR/FNR-H/SMA/STE/DCS/NHG metric specs + dummy world-model baseline + 诊断报告 stub），**不是 20K trajectories**。

## 12. adapters（EBench & AutoBio）
- **EBench**：“a compatibility target and design reference, not the base framework.” 吸收：multi-axis capability profile、client-server model interface、action chunking、train/test/generalization split、diagnostic report、依赖隔离。留在 adapter：GenManip runtime、Isaac Sim 4.1 lock-in、Lift2 embodiment、EBench score schema、dataset layout、server/client 命令、camera names、action dims。mapping：EBench task→imported TaskSpec；GenManip→adapter runtime config；Lift2→一个 EmbodimentSpec；EBench score→MetricResult；Isaac 4.1→legacy BackendProfile（`ebench_genmanip_legacy.yaml`, `purpose: compatibility_only`）。adapter smoke 目标：`EBench/GenManip episode → EBenchAdapter → EpisodeTrace → MetricResult → Report stub`，**不是 full reproduction**。代码：`adapters/ebench/{import_task,map_score,runtime_probe,fixture_trace,smoke_*}.py`。
- **AutoBio**：MuJoCo 上的数字生物实验室 benchmark（arXiv:2505.14030，HKU/TeleAI/Tsinghua/SJTU）。**16 tasks，三难度**；自定义 MuJoCo 插件：螺纹（用 SDF of circular helix 而非 mesh 碰撞）、detent、eccentric、quasi-static liquid；机器人 UR5e/ALOHA/Robotiq/DexHand；资产经 PGSR 3D Gaussian Splatting→CAD→watertight MJCF；渲染 MuJoCo OpenGL + Blender PBR bridge。两种复现模式：**faithful**（`adapters/autobio/`+`mujoco_autobio.yaml`）与 **semantic**（`scenario_packs/scientific_lab/`），semantic 复现**不得声称与 AutoBio 插件物理等价**。代码：`adapters/autobio/runtime_probe.py` 产 `embodied_eval_os_autobio_runtime_probe.v0` 报告，component 全 `not_started`，`runtime_status="not_executed"`，**只是 readiness probe 不是 run**（= compatibility smoke）。
- adapter 共享契约 `adapters/runtime_contract.py::validate_runtime_trace(...)`：要求 adapter 产出的 trace 在 `episode_metrics` 与 `metadata` 双写 `runtime_status/runtime_attempted`、有 claim_boundary、外部 provenance 一致（`metadata.external_commit==versions.external_commit`）；`RUNTIME_STATUSES={"executed","skipped"}`。

## 13. 两条评测路径（代码事实）
- **Path A（简单 in-process）= `EpisodeRunner`**（`core/runtime/episode_runner.py`）。`@dataclass EpisodeRunner(backend, model, task_spec, scene_spec, max_steps=100)`，`run(seed)->EpisodeTrace`。backend/model 是 `Protocol`（`EpisodeBackend`: `load_scene/reset/step/measure/project_physical_state`；`EpisodeModel`: `reset/act`）。`STANDARD_BACKEND_COMPONENTS=("platform","physics","renderer","sensors","control","process_runtime")` 强制写进每条 trace。`_current_repo_commit()` 记**所属 repo** HEAD（用 `git -C <repo_root>`，刻意忽略 CWD，有测试守）。`examples/run_smoke.py` 走这条：`SemanticProxyBackend` + `RandomPolicyAdapter(delta=0.4)`，`max_steps=10`，`run(seed=42)`，再 `TaskOutcomeEvaluator().evaluate_episode(trace)`，可 `TraceStore(dir).save_json(trace)`。
- **Path B（provider / evidence-chain live loop）= RPF-10/EVL** （`runtime/live_model_loop.py::run_rpf10_live_model_loop`）。链路：`provider.materialize()(→WorldSession) → reset → measure(pre) → _build_model_visible_observation()(脱敏：去掉 privileged、native dump、solver diagnostics、evaluator truth) → policy.act(...) → _control_request_from_action()(→WorldSessionControlRequest) → apply_control(→ack) → step → measure(post) → query_evidence(process_runtime_telemetry/solver_diagnostics/native_state_dump) → 建 post PhysicalStateProjection → motion_delta → evaluator_result → close → 组装 EpisodeTrace(TraceStep.task_semantic_state.procedure_state["runtime_flow"]) → report.json`。每个产物都是 hash 寻址的 `ArtifactRef`；report 带 `claim_flags`（backend_parity/pickup_task_success/official_benchmark_reproduction/hardware_readiness/real_world_safety/model_superiority/metasim_compatibility）**全 False**。缺 pre/post state → `_finalize_blocked_loop()` 记 `blocking_reasons`，不填 0。强类型验收 = `core/runtime/episode_execution.py::EpisodeExecutionResult`（`task_success` 仅当 `EvaluatorOutcomeArtifact.accepted_for_linkage` 才非 None）。

## 14. Runtime Provider Facade（RPF，backend-composability.md / runtime-provider-facade-contract.md）
- EOS 借 MetaSim 的**工程外形**（一个暴露动词的 facade），但不接受「一个 handler = 一个 backend」「handler state 物理可比」的含义。
- **八个动词**：`materialize  reset  apply_state  apply_control  step  measure  query  close`。前七个驱动一次 run，`query/close` 辅助。
- facade 必须保留组件拆分；证据边界 = provider 产出的 artifact-backed L3 measurement / readiness result。单个 `simulator` 字符串**不是 EOS 里的 backend identity**。
- RPF 进度（index.md）：RPF-1→6 关（boundary/contract/dummy/query-evidence/external-solver-pilot/pickup-bridge）；**RPF-7A** 首个 fresh **MuJoCo 3.3.0** live provider（`status: executed_pass`，真 motion_delta）；**RPF-7B** fixture-driven 通用 conformance kit；**RPF-8** scenario/materialization 驱动（scenario 声明世界，不是 provider 自己写 MJCF）；**RPF-9** **PyBullet + Genesis 0.4.4** live providers（“不止 MuJoCo”）；**RPF-10** PyBullet + `scripted_demonstrator` live model loop（`privileged_state_visible_to_model: false`, `standard_model_score: null`）。RPF-11（parallel/hybrid）可选、非默认下一步。

## 15. release claim levels（release-claim-boundary.md）—— 由窄到宽，叙述里不许跳级
`contract implemented → fixture conformance passed → live SDK lane executed → scenario evaluator executed → suite diagnostic executed → release live gate passed`。
“a live SDK lane is not a benchmark score, and a scenario evaluator result is not backend parity.” 必须显式声明 required non-claims（backend/trajectory/contact-force parity、visual/pixel parity、model superiority、standard benchmark score、official benchmark reproduction、hardware readiness、real-world safety、MetaSim/RoboVerse integration）。
**Forbidden Claim Catalog**（reporting-and-claim-boundary.md §8，未配证据不得用这些词）：MetaSim integration/compatibility、universal simulator handler、universal robot state、TensorState-compatible EOS、backend/trajectory/contact/force-vector parity、visual or pixel parity、OpenVLA/LeRobot success、LIBERO/ManiSkill reproduction、RoboVerse compatibility、pickup solved、task success、official benchmark reproduction、all-backend coverage、hardware readiness、real-world safety、parallel speedup without measured resource evidence。

## 16. 走过的硬仗（docs/records 时间线，叙事用）
- **trace/evidence spine（2026-05-28）**：奠基日。`initial-design-decisions` 五条创世决定（别按实验室命名 core；trace 里拆 physics/renderer；EBench 是 adapter；safety 是通用 hazard 评测；模型契约超越 VLA）。`trace-evidence-spine` 立 EpisodeTrace/TraceStep/TraceStore/EpisodeRunner + 默认 claim boundary。
- **AutoBio 复现的清算（05-29~31）**：能不能不污染 core 地用 EOS 自己的层表达 AutoBio 风格任务？最终 `autobio-final-faithful-reproduction-claim-review` 判定 **`faithful_reproduction_not_approved`**——“roadmap completion is explicitly not faithful reproduction or official AutoBio full-chain execution.” AutoBio 的 `Expert` → 通用 `ReferencePolicyProfile`。
- **Genesis-owned 执行 & 状态迁移（06-01~03）**：`stage50` 经典 bug——把 raw qpos 向量**按数值位置**在两个 joint layout 不同的后端间拷贝 → Genesis 互穿/clipping。修法：按 joint name 重映射，缺关节/宽度不符就 hard-fail。升华为 core 的 `generic-state-transfer-contract`（`StateComponentSpec/StateTransferMapEntry/...`，raw-vector transfer without layout identity = structured blocker）。`genesis-mujoco-plugin-perfect-parity-plan` 把「plugin perfect reproduction」重定义为**可观测**的 MuJoCo-oracle parity，且最终 `stage90_status=planned_unapproved`（从未批准）。
- **WorldState Runtime WR-1…WR-8H（06-04~09）**：核心架构 epic。pickup 视频不一致是「缺地基」的症状 → **把 AutoBio 任务从架构拥有者降级为 regression scenario**。`standard-worldsession-layering` 立 L0–L6。`l2-l3-layering-clarification` 三轴解耦（layer ownership L0–L6 / interchange format USD-MJCF / runtime truth MuJoCo-Genesis-PhysX-real），北极星：“Under the same task and evidence rules, different physics backends produce results that can be measured, projected, compared, and audited without overclaiming.” WR-7 从「同起点」转向「**两引擎随时间何处首次分叉**」= paired dynamic trace（轴 robot_action_replay/tube_cap_body_retention/finger_cap_contact/contact_force/tube_lift/task_phase_semantics + first-divergence step/phase），WR-7D `gate_status=failed`（成功的**诊断**，不是 parity claim）。引入 **raw vs primitive-assisted Genesis lane** 分裂。WR-8H 关一个 lane-scoped L3 任务语义 outcome（`primitive_assisted_genesis_l3_task_semantic_outcome=true` 而 `raw_genesis_lane_task_success=false`，video 只作 visual support）。phase closure 诚实总结：“能说两引擎在哪一致、在哪分叉、assisted lane 支持哪个上层 outcome；**还不能说 Genesis native physics 复现了 MuJoCo pickup physics**。”
- **judgeable loop R1…R15（06-10）**：把分叉变成**完全记账**的账本。fairness gates（同 state0 hash、同 action schedule、control ack、joint response）gate 物理 verdict；verdict 词汇 `matched/mismatched/blocked_with_evidence/not_compared`。R13 证 7 个公共 actuator 的**力律项相等**（`force = gain·target + bias0 + bias1·qpos + bias2·qvel`，差 0.0）。`r15` 关为 `closed_with_accounted_non_equivalences`，`unaccounted_blocking_reasons=[]`——每个剩余 mismatch 都从「未知 blocker」变成「证据支撑、显式声明的 non-equivalence」，parity 仍不声称。
- **MetaSim 吸收 → RPF → live model loop → EVL（06-11~12，前沿）**：`metasim-runtime-boundary-review` 决定**不依赖 MetaSim、不抄它的 API**，但借 facade/lazy dispatch/query channels/readiness matrices。RPF-1…10 见 §14。**当前前沿 = EVL-1**（Evidence-backed Visual Model Evaluation Lane）：RGB observation evidence（`.npy` 帧、hash）、stdlib `HTTPPolicyAdapter`（真模型 sidecar）、`visual_manipulation_micro` 微场景、10-episode 诊断 suite + failure taxonomy + forbidden-claim checker。**EVL-2**（命名的下一步）= 用真 sidecar model server 替换 scripted policy。
- 词汇：**WR** WorldState Runtime；**ERF** Embodiment Runtime Foundation（ERF-0…6 全关；显式**不是** universal Robot class）；**State V2** 改名硬重构；**RPF** Runtime Provider Facade；**EVL** Visual Model Evaluation Lane；**AX-1** 活跃架构 cutover/cleanup（出现在近期 git commit）；**outcome closure** vs **contract closure**（关一个*结果* vs 仅证据链存在）。

## 17. 工作流（capstone/PR 章节用）
- PR 前必跑：`python examples/run_smoke.py`、`pytest -q`、`python scripts/check_core_leakage.py`。DSW/CPFS 上用 `$EEOS_PYTHON`（`.../envs/embodied-eval-os-py310/bin/python`）。
- gate 层级：`make check / check-local`（快 commit gate=smoke+non-scenario pytest+leakage+state-v2+profile-check+diff-check）、`make check-pr`、`make check-merge`、`make release-live-gate / release-live-sdk-gate`。
- Record Rule：非平凡改动加 dated record `docs/records/YYYY-MM-DD-short-title.md`，含 `Context / Decision-Change / Files touched / Validation / Known limitations / Next actions`。
- PR 模板含 **Core boundary check** 与 **Claim boundary（What this PR proves / does not prove）**。
- pyproject：name `embodied-eval-os` v0.1.0，Apache-2.0，py>=3.10，运行时依赖**只有** `pyyaml, typing-extensions`（sim 引擎都是 adapter 侧可选）。

## 18. 外部参照（research 已核实，含纠错；引用务必准确）
- **MetaSim / RoboVerse**（arXiv:2504.18904；Pieter Abbeel、Jitendra Malik 等 37 人）：统一配置系统 + 每 sim 的 **Handler**（`BaseSimHandler` 子类如 `MujocoHandler/IsaacLabHandler/MJXHandler/PybulletHandler/SapienHandler`）+ Gym wrapper。三能力：cross-simulator integration / hybrid simulation / cross-embodiment transfer。`TensorState`（按 lexicographical order 组织 DoF/body，分 objects/robots/cameras）。生命周期方法 `launch / get_state / set_state / simulate / close` + `get_joint_names/get_body_names`。**注意：文档没有「恰好 8 个动词」的列表——别把 EOS 的 8 RPF 动词说成 MetaSim 的。** 宣称统一「11 simulators」/三方概述「8+ engines」/dataset “1,000+ tasks、10M+ transitions”（部分来自三方摘要，标“据 paper/摘要”）。
- **Genesis**（genesis-embodied-ai；`genesis-world`；2024-12-19 首发）：纯 Python，多 solver（Rigid/MPM/SPH/FEM/PBD/Stable Fluid）跨材质耦合。**43M FPS / Franka / 单 RTX 4090 / 430,000× 实时**，宣称比 Isaac Gym 快 10–80×。v0.3 时**只有 MPM+Tool solver 可微**（别说全可微）。EOS 用 Genesis 0.4.4。
- **NVIDIA Newton**（NVIDIA+Google DeepMind+Disney，Linux Foundation，Apache-2.0，基于 Warp+OpenUSD）：**2026 仍是 beta，不是 1.0**（别写 1.0）。集成 MuJoCo Warp；2025-09-29 CoRL beta，在 Isaac Lab 内。
- **MuJoCo**（Google DeepMind）：optimization-based 软接触；**MJX**(JAX) 是 MuJoCo 3 的 GPU 路径；**MuJoCo Warp**(与 NVIDIA) 喂 Newton。
- **PyBullet/Bullet**（Erwin Coumans，2017 引入 PyBullet，Zlib）：轻量开源、Python 友好，是标准的「轻量基线」后端。
- **Isaac Sim vs Isaac Lab**：Isaac Sim = Omniverse 上的全功能仿真器（USD+PhysX+RTX）；Isaac Lab = 其上的轻量机器人学习框架（取代 Isaac Gym/Orbit），现支持 PhysX/Warp/Newton/MuJoCo 多后端。EBench 用的是 Isaac Sim 4.1（早于 2025 的 5.0/2.2 GA）。
- **跨引擎/sim2sim parity 问题**：同任务在不同引擎结果不同，因接触是 NCP，各引擎为速度/稳定**各自松弛**（线性化摩擦锥→LCP；软化互补→穿透）。证据：**SimBenchmark**（RaiSim/Bullet/ODE/MuJoCo/DART，engine 表现 task-dependent）、cloth manipulation benchmark（quasi-static 都低误差，dynamic 没有引擎精确匹配，MuJoCo 最好）、PolySim。
- **评测科学**：construct validity = **Jacobs & Wallach, FAccT 2021**（operationalization gap）；**Raji et al., NeurIPS 2021**（"Everything in the Whole Wide World Benchmark"，general benchmark 测不出它宣称的普适能力）；**Bowman & Dahl, NAACL 2021**（NLU benchmarking is broken）。reproducibility = **Henderson et al., AAAI 2018**（"Deep RL that Matters"，extrinsic/intrinsic 变异，要 seed/显著性）；**Pineau et al., JMLR 2021**（NeurIPS reproducibility checklist）。sim2real = **Tobin et al., IROS 2017**（domain randomization，"reality gap"）；**Zhao et al., 2020 survey**。world model 评测 = **Tian, Finn, Wu, VP², ICLR 2023**（"perceptual video metrics can be unreliable at predicting execution success" —— 世界模型要按 planning usefulness 评，不是像素保真）；**DreamerV3, Nature 640:647–653 (2025)**。证据/provenance = **Model Cards (Mitchell et al., FAT* 2019)**、**Datasheets for Datasets (Gebru et al., CACM 2021)**。多轴 vs 单标量 = **HELM (Liang et al., 2022)**、**Dynabench (Kiela et al., NAACL 2021)**、**BEHAVIOR / BEHAVIOR-1K (CoRL 2022/2023)**。
- **纠错（别引错）**：「It's Not Just Size That Matters」是 **Schick & Schütze, NAACL 2021**（不是 Liao，且是 few-shot 方法论文，不是 validity 批评）；VP² 是 **ICLR 2023**（不是 ICML）；DreamerV3 Nature 版标题是 "Mastering diverse control **tasks**…"。

# 输出
直接用 Write 写出指派给你的每个 HTML 文件到正确路径。写完回报：写了哪些文件、各用了哪个 widget、有无存疑事实。务必：claim boundary 用 `.callout.claim`；该用桥就用桥；术语用 `<span class="term">`；代码引真实文件路径。
