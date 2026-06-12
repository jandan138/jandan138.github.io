/* layer-stack — L0–L6 运行时-世界分层探索器。
   点一层：看它拥有什么、产物是什么、那条最容易踩错的规则。 */
(function () {
  window.EOSWidgets["layer-stack"] = function (root) {
    const LAYERS = [
      { k: "L0", n: "Resource / Asset", col: "neutral", owns: "原始资产、网格、URDF/MJCF/USD 文件。", prod: "ExternalAssetRef / AssetBundleManifest", rule: "USD 在这里只是资产/拓扑的引用，不是“活的世界”。" },
      { k: "L1", n: "EvaluationWorldSpec", col: "neutral", owns: "一次评测要装配的世界的静态声明。", prod: "world spec", rule: "声明，不含 rollout 结果。" },
      { k: "L2", n: "WorldSession", col: "accent", owns: "live runtime 的 session 信封：lifecycle、clock、domain channels、control、sensors、capability 声明。", prod: "WorldSession（在 runtime/，不在 core）", rule: "“USD-covering, not USD-shaped”。不是 USD clone，也不是 per-step state 的拥有者。" },
      { k: "L3", n: "RuntimeMeasurementSnapshot", col: "interactive", owns: "在时间/事件边界上“测量/导出”的跨后端证据。", prod: "RuntimeMeasurementSnapshot（artifact-backed, capability-scoped）", rule: "不保证完整 / 可恢复 / 可独立比较。缺的字段记成 missing，不填 0。" },
      { k: "L4", n: "PhysicalStateProjection", col: "ev", owns: "把后端 raw state 归一化成 simulator-neutral 的物理投影。", prod: "PhysicalStateProjection(time_s, robots, objects, joints, contacts)", rule: "这里的 qpos/qvel 是投影的<i>字段值</i>，不是 core 的 API 名。" },
      { k: "L5", n: "TaskSemanticState", col: "claim", owns: "场景拥有的语义：process / procedure / hazard / evaluator 字段。", prod: "TaskSemanticState", rule: "core 不知道场景字段名（finger_cap_contact…），只存 schema 化的 payload。" },
      { k: "L6", n: "Evidence Ledger / EpisodeTrace", col: "warn", owns: "把一切按时间索引串成可审计的证据账本。", prod: "EpisodeTrace", rule: "trace 是 the source of truth & the product boundary。" },
    ];
    let sel = 6;
    const c = (n) => EOSW.c(n);
    const wrap = EOSW.el("div", { style: "display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start" });
    const stack = EOSW.el("div", { style: "flex:0 0 240px;display:flex;flex-direction:column-reverse;gap:6px" });
    const panel = EOSW.el("div", { style: "flex:1;min-width:240px;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:14px 16px" });
    const btns = LAYERS.map((L, i) => {
      const b = EOSW.el("button", { style: "text-align:left;border:1px solid var(--border-strong);border-radius:9px;padding:8px 12px;cursor:pointer;background:var(--surface);color:var(--ink);font-family:var(--sans)" });
      b.innerHTML = `<b style="font-family:var(--mono);color:var(--ink-faint)">${L.k}</b> ${L.n}`;
      b.addEventListener("click", () => { sel = i; render(); });
      stack.appendChild(b); return b;
    });
    wrap.appendChild(stack); wrap.appendChild(panel); root.appendChild(wrap);
    function render() {
      btns.forEach((b, i) => {
        const on = i === sel, col = c(LAYERS[i].col);
        b.style.borderColor = on ? col : c("border-strong");
        b.style.background = on ? col + "1a" : c("surface");
        b.style.boxShadow = on ? `inset 3px 0 0 ${col}` : "none";
      });
      const L = LAYERS[sel];
      panel.innerHTML =
        `<div style="font-family:var(--mono);font-size:.72rem;color:${c(L.col)};margin-bottom:4px">${L.k} · ${L.n}</div>` +
        `<p style="margin:0 0 10px;color:var(--ink-soft);font-size:.9rem;line-height:1.6"><b style="color:var(--ink)">拥有：</b>${L.owns}</p>` +
        `<div style="font-size:.82rem;color:var(--ink-faint);margin-bottom:8px"><b style="color:var(--ink-soft)">产物：</b><span style="font-family:var(--mono)">${L.prod}</span></div>` +
        `<div style="font-size:.84rem;color:var(--ink-soft);border-top:1px dashed var(--border);padding-top:8px"><b style="color:var(--claim)">⚖ 易错点：</b>${L.rule}</div>`;
    }
    render();
  };
})();
