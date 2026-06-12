/* rpf-verbs — Runtime Provider Facade 的八个动词驱动一次 episode。
   播放看时序；在 measure 一步看 model-visible 脱敏。 */
(function () {
  window.EOSWidgets["rpf-verbs"] = function (root) {
    const V = [
      { v: "materialize", d: "scenario 声明世界 → provider 装配 WorldSession（L2 信封）。", art: "provider_manifest" },
      { v: "reset", d: "回到 episode 初态，记录 reset evidence。", art: "reset_artifact" },
      { v: "apply_state", d: "（可选）按 semantic component map 设置初态，非按裸向量。", art: "state_apply_ack" },
      { v: "apply_control", d: "把模型动作变成 control request，provider 回 ack（接受/拒绝）。", art: "control_ack" },
      { v: "step", d: "推进一步物理。", art: "—" },
      { v: "measure", d: "导出 L3 RuntimeMeasurementSnapshot。模型只看脱敏后的观测。", art: "measurement_snapshot" },
      { v: "query", d: "按需取 process telemetry / solver diagnostics / native dump（多为 evaluator-only）。", art: "query_evidence" },
      { v: "close", d: "释放会话，封存证据链。", art: "—" },
    ];
    let i = 0, timer = null;
    const c = (n) => EOSW.c(n);
    const row = EOSW.el("div", { style: "display:flex;gap:4px;flex-wrap:wrap;align-items:center;margin-bottom:12px" });
    const chips = V.map((x, k) => {
      const ch = EOSW.el("span", { class: "chip", style: "font-size:.74rem" }, `${k + 1}. ${x.v}`);
      ch.addEventListener("click", () => { stop(); i = k; render(); });
      row.appendChild(ch);
      if (k < V.length - 1) row.appendChild(EOSW.el("span", { style: "color:var(--ink-faint)" }, "›"));
      return ch;
    });
    const panel = EOSW.el("div", { style: "border:1px solid var(--border);border-radius:10px;padding:14px 16px;background:var(--surface-2);min-height:96px" });
    const ctrls = EOSW.el("div", { class: "ctrl-row" });
    const playBtn = EOSW.el("button", { class: "btn primary" }, "▶ 播放时序");
    const stepBtn = EOSW.el("button", { class: "btn" }, "单步 →");
    playBtn.addEventListener("click", () => { timer ? stop() : play(); });
    stepBtn.addEventListener("click", () => { stop(); i = (i + 1) % V.length; render(); });
    ctrls.appendChild(playBtn); ctrls.appendChild(stepBtn);
    root.appendChild(row); root.appendChild(panel); root.appendChild(ctrls);

    function play() { playBtn.textContent = "⏸ 暂停"; timer = setInterval(() => { i = (i + 1) % V.length; render(); }, 1400); }
    function stop() { if (timer) { clearInterval(timer); timer = null; playBtn.textContent = "▶ 播放时序"; } }
    function render() {
      chips.forEach((ch, k) => ch.classList.toggle("on", k === i));
      const x = V[i];
      let extra = "";
      if (x.v === "measure") extra = `<div style="margin-top:8px;font-size:.8rem;color:var(--claim)">⚖ model-visible observation 会去掉：privileged state、native dump、solver diagnostics、evaluator truth。</div>`;
      panel.innerHTML =
        `<div style="font-family:var(--mono);color:var(--accent);font-size:.9rem;margin-bottom:4px">${i + 1} / 8 · ${x.v}()</div>` +
        `<div style="color:var(--ink-soft);font-size:.9rem;line-height:1.55">${x.d}</div>` +
        `<div style="margin-top:6px;font-size:.78rem;color:var(--ink-faint)">产物：<span style="font-family:var(--mono)">${x.art}</span>（hash 寻址的 ArtifactRef）</div>` + extra;
    }
    render();
  };
})();
