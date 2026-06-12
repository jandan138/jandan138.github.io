/* core-placement — 把概念放进 core / scenario_packs / adapters。
   点一个概念循环它的归属；点"验收"看 check_core_leakage.py 会不会标红。 */
(function () {
  window.EOSWidgets["core-placement"] = function (root) {
    const BINS = ["core", "scenario_packs", "adapters"];
    const BINCOL = { core: "accent", scenario_packs: "ev", adapters: "eb" };
    // correct: 正确归属; forbidden: 落进 core 会被 leakage checker 标红的 token
    const ITEMS = [
      { t: "EpisodeTrace", correct: "core" },
      { t: "TaskSpec", correct: "core" },
      { t: "BackendProfile", correct: "core" },
      { t: "MetricResult", correct: "core" },
      { t: "PipettePrimitive", correct: "scenario_packs", forbidden: "pipette" },
      { t: "tube_cap_body_retention", correct: "scenario_packs", forbidden: "tube_rack/contamination 一类场景词" },
      { t: "ContaminationMetric", correct: "scenario_packs", forbidden: "contamination" },
      { t: "GenManipTask", correct: "adapters", forbidden: "genmanip" },
      { t: "Lift2Action", correct: "adapters", forbidden: "lift2" },
      { t: "EvalClient", correct: "adapters", forbidden: "evalclient" },
    ];
    ITEMS.forEach((it) => (it.bin = "core")); // 故意都先丢进 core，制造"污染"
    const c = (n) => EOSW.c(n);

    const grid = EOSW.el("div", { style: "display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px" });
    const cols = {};
    BINS.forEach((b) => {
      const col = EOSW.el("div", { style: `border:1px solid ${c(BINCOL[b])};border-radius:10px;padding:8px;min-height:120px;background:${c(BINCOL[b])}0d` });
      col.appendChild(EOSW.el("div", { style: `font-family:var(--mono);font-size:.74rem;color:${c(BINCOL[b])};margin-bottom:6px;font-weight:600` }, b + "/"));
      const body = EOSW.el("div", { style: "display:flex;flex-direction:column;gap:5px" });
      col.appendChild(body); cols[b] = body; grid.appendChild(col);
    });

    const bar = EOSW.el("div", { class: "ctrl-row", style: "margin-top:12px;align-items:center" });
    const checkBtn = EOSW.el("button", { class: "btn primary" }, "验收 · run check_core_leakage.py");
    const resetBtn = EOSW.el("button", { class: "btn" }, "重置");
    const out = EOSW.el("div", { style: "margin-top:10px;font-size:.85rem" });
    bar.appendChild(checkBtn); bar.appendChild(resetBtn);
    root.appendChild(grid); root.appendChild(bar); root.appendChild(out);

    function chipFor(it) {
      const chip = EOSW.el("button", { class: "chip", style: "justify-content:space-between;width:100%" });
      chip.innerHTML = `<span>${it.t}</span><span style="color:var(--ink-faint);font-size:.66rem">↻</span>`;
      chip.addEventListener("click", () => {
        it.bin = BINS[(BINS.indexOf(it.bin) + 1) % 3];
        render(); out.innerHTML = "";
      });
      return chip;
    }
    function render() {
      BINS.forEach((b) => (cols[b].innerHTML = ""));
      ITEMS.forEach((it) => cols[it.bin].appendChild(chipFor(it)));
    }
    checkBtn.addEventListener("click", () => {
      const leaks = ITEMS.filter((it) => it.bin === "core" && it.forbidden);
      const wrong = ITEMS.filter((it) => it.bin !== it.correct);
      let html = "";
      if (leaks.length) {
        html += `<div style="color:var(--bad);font-family:var(--mono);font-size:.8rem">`;
        leaks.forEach((it) => html += `FORBIDDEN token '${it.forbidden}' in core/ (${it.t})<br>`);
        html += `exit 1 · CI ❌</div>`;
      } else {
        html += `<div style="color:var(--ok);font-family:var(--mono);font-size:.8rem">no core leakage detected · exit 0 ✅</div>`;
      }
      if (wrong.length) {
        html += `<div style="margin-top:6px;color:var(--ink-soft)">归属仍有 ${wrong.length} 处与设计不符（leakage checker 只拦 core 里的禁词，<i>放错 pack/adapter 它不管</i>——那要靠 review）。正确归属：` +
          wrong.map((it) => `<span class="term">${it.t}</span>→${it.correct}`).join("、") + "。</div>";
      } else if (!leaks.length) {
        html += `<div style="margin-top:6px;color:var(--ok)">全部归位 🎉 core 只剩场景中立的契约。</div>`;
      }
      out.innerHTML = html;
    });
    resetBtn.addEventListener("click", () => { ITEMS.forEach((it) => (it.bin = "core")); render(); out.innerHTML = ""; });
    render();
  };
})();
