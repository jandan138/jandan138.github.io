/* fidelity-ladder — CapabilityTier → 可以说什么 / 不能说什么。
   选一个组件，再在五级保真度阶梯上选一档，看它把 claim boundary 卡在哪。 */
(function () {
  window.EOSWidgets["fidelity-ladder"] = function (root) {
    const TIERS = ["NATIVE", "REDUCED", "SEMANTIC_PROXY", "EMULATED", "UNSUPPORTED"];
    const COMPS = [
      { key: "physics", label: "physics 物理" },
      { key: "renderer", label: "renderer 渲染" },
      { key: "sensors", label: "sensors 传感" },
      { key: "process_runtime", label: "process_runtime 过程" },
    ];
    // 每个 (组件, tier) → {may, not}
    const D = {
      physics: {
        NATIVE: ["把引擎原生求解器算出的接触/动力学，当作“在该引擎语境内”的物理证据。", "跨引擎物理等价、trajectory / contact-force parity、real-world dynamics。"],
        REDUCED: ["动力学的大致趋势（降级模型）。", "精确接触力、数值保真。"],
        SEMANTIC_PROXY: ["仅任务语义层面的成败（由简化模型驱动）。", "任何真实物理结论——连“近似动力学”都不许声称。"],
        EMULATED: ["由非原生路径模拟出的行为，但必须标注来源。", "与原生求解器等价。"],
        UNSUPPORTED: ["无——此后端不提供物理。", "任何依赖物理的结论。"],
      },
      renderer: {
        NATIVE: ["把渲染帧当作视觉观测证据（在该渲染器语境内）。", "跨渲染器视觉等价、pixel parity、等同真实相机。"],
        REDUCED: ["低保真的视觉趋势。", "外观 / 材质 / 光照保真。"],
        SEMANTIC_PROXY: ["用占位/示意图像表达“有没有视觉输入”。", "任何真实外观结论。"],
        EMULATED: ["离线或替代路径重渲染的帧，标注来源。", "与原生 RTX 渲染等价。"],
        UNSUPPORTED: ["无图像。", "任何视觉/外观相关结论（包括“看起来抓住了”）。"],
      },
      sensors: {
        NATIVE: ["把该传感器读数（force/torque、proprioception 等）当作证据。", "传感器标定/噪声等同真实硬件。"],
        REDUCED: ["降采样或降精度的读数。", "精确量纲与标定。"],
        SEMANTIC_PROXY: ["语义化的“传感事件”（如“接触发生了”）。", "真实物理量。"],
        EMULATED: ["由其他量推算出的读数，标注来源。", "与原生传感等价。"],
        UNSUPPORTED: ["无此传感。", "任何依赖该传感的结论。"],
      },
      process_runtime: {
        NATIVE: ["引擎原生支持的场景状态转移。", "（罕见）多数场景语义并非引擎原生。"],
        REDUCED: ["简化的状态机/过程模型。", "高保真过程。"],
        SEMANTIC_PROXY: ["场景语义的过程代理（如 reduced liquid model 给出的液量变化）。", "真实流体 / CFD / microfluidics / 化学反应。"],
        EMULATED: ["用脚本或规则模拟的过程，标注来源。", "物理过程等价。"],
        UNSUPPORTED: ["无场景语义状态机。", "任何依赖过程语义的结论。"],
      },
    };
    let comp = "physics", tier = "NATIVE";
    const c = (n) => EOSW.c(n);

    const chips = EOSW.el("div", { style: "display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px" });
    const compBtns = COMPS.map((x) => {
      const b = EOSW.el("button", { class: "chip" + (x.key === comp ? " on" : "") }, x.label);
      b.addEventListener("click", () => { comp = x.key; render(); });
      chips.appendChild(b); return { key: x.key, b };
    });

    const wrap = EOSW.el("div", { style: "display:flex;gap:16px;flex-wrap:wrap;align-items:stretch" });
    const ladder = EOSW.el("div", { style: "flex:0 0 200px;display:flex;flex-direction:column;gap:6px" });
    const tierBtns = TIERS.map((t, i) => {
      const b = EOSW.el("button", { style: "text-align:left;border:1px solid var(--border-strong);border-radius:9px;padding:9px 12px;cursor:pointer;background:var(--surface);color:var(--ink);font-family:var(--mono);font-size:.8rem;display:flex;justify-content:space-between;align-items:center" });
      b.innerHTML = `<span>${t}</span><span style="font-family:var(--sans);font-size:.66rem;color:var(--ink-faint)">L${i}</span>`;
      b.addEventListener("click", () => { tier = t; render(); });
      ladder.appendChild(b); return { t, b };
    });
    const panel = EOSW.el("div", { style: "flex:1;min-width:240px;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:14px 16px" });
    wrap.appendChild(ladder); wrap.appendChild(panel);
    root.appendChild(chips); root.appendChild(wrap);

    function tierColor(t) {
      if (t === "NATIVE") return c("ok");
      if (t === "UNSUPPORTED") return c("neutral");
      return c("claim"); // 中间几档都是"有边界"的琥珀色
    }
    function render() {
      compBtns.forEach((x) => x.b.classList.toggle("on", x.key === comp));
      tierBtns.forEach((x) => {
        const on = x.t === tier, col = tierColor(x.t);
        x.b.style.borderColor = on ? col : c("border-strong");
        x.b.style.background = on ? col + "1f" : c("surface");
        x.b.style.boxShadow = on ? `inset 3px 0 0 ${col}` : "none";
        x.b.style.fontWeight = on ? "700" : "400";
      });
      const [may, not] = D[comp][tier];
      const col = tierColor(tier);
      panel.innerHTML =
        `<div style="font-family:var(--mono);font-size:.72rem;color:${col};margin-bottom:2px">${comp} · ${tier}</div>` +
        `<div style="font-size:.82rem;color:var(--ink-faint);margin-bottom:12px">声明这一档，等于提前把下面这条边界写进合同。</div>` +
        `<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;font-size:.88rem;line-height:1.55;align-items:start">` +
        `<span class="verdict matched" style="white-space:nowrap">可以说</span><span style="color:var(--ink-soft)">${may}</span>` +
        `<span class="verdict blocked" style="white-space:nowrap">不能说</span><span style="color:var(--ink-soft)">${not}</span>` +
        `</div>`;
    }
    render();
  };
})();
