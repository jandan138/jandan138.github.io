/* claim-ladder — release claim levels，由窄到宽。
   点一级，看你"可以说什么 / 还不能说什么"。叙述里不许跳级。 */
(function () {
  window.EOSWidgets["claim-ladder"] = function (root) {
    const L = [
      { k: "contract implemented", may: "证据类型/契约已定义、有单元测试。", not: "还没真跑过任何后端 SDK。" },
      { k: "fixture conformance passed", may: "在 fixture-driven conformance kit 上通过——接口形状对了。", not: "还没碰真实仿真器。" },
      { k: "live SDK lane executed", may: "一个真实 provider 跑通了八动词，记录了 operation/measurement/query/readiness/trace/report。", not: "不证明 backend parity、task success、官方复现、硬件就绪、real-world safety、MetaSim 兼容。" },
      { k: "scenario evaluator executed", may: "场景 evaluator 跑出了 metric（如 motion-to-goal progress）。", not: "一个 evaluator 结果 ≠ backend parity，≠ 模型更强。" },
      { k: "suite diagnostic executed", may: "一个 seeded 多 episode suite 跑出了诊断报告 + failure taxonomy。", not: "不是 standard benchmark score，不是 OpenVLA/LIBERO 复现。" },
      { k: "release live gate passed", may: "release gate 全绿：视觉 suite + conformance + 审计 + manifest 检查都过。", not: "依然不声称 real-world safety / hardware readiness / 官方 benchmark 复现。" },
    ];
    let sel = 2;
    const c = (n) => EOSW.c(n);

    const rail = EOSW.el("div", { style: "display:flex;flex-direction:column;gap:0" });
    const btns = L.map((lv, i) => {
      const b = EOSW.el("button", { style: "display:flex;align-items:center;gap:10px;text-align:left;border:none;background:none;cursor:pointer;padding:7px 4px;font-family:var(--sans);color:var(--ink)" });
      b.innerHTML =
        `<span class="dot" style="flex:0 0 auto;width:14px;height:14px;border-radius:50%;border:2px solid var(--border-strong)"></span>` +
        `<span style="font-family:var(--mono);font-size:.66rem;color:var(--ink-faint)">L${i}</span>` +
        `<span class="lbl" style="font-size:.86rem">${lv.k}</span>`;
      b.addEventListener("click", () => { sel = i; render(); });
      return b;
    });
    rail.append(...btns);
    const panel = EOSW.el("div", { style: "margin-top:12px;border:1px solid var(--border);border-radius:10px;padding:14px 16px;background:var(--surface-2)" });
    root.appendChild(rail); root.appendChild(panel);

    function render() {
      btns.forEach((b, i) => {
        const on = i <= sel, cur = i === sel;
        b.querySelector(".dot").style.background = on ? c("accent") : "transparent";
        b.querySelector(".dot").style.borderColor = on ? c("accent") : c("border-strong");
        b.querySelector(".lbl").style.fontWeight = cur ? "700" : "400";
        b.querySelector(".lbl").style.color = cur ? c("accent") : c("ink");
      });
      const lv = L[sel];
      panel.innerHTML =
        `<div style="font-family:var(--mono);font-size:.72rem;color:var(--accent);margin-bottom:6px">L${sel} · ${lv.k}</div>` +
        `<div style="display:grid;grid-template-columns:auto 1fr;gap:6px 12px;font-size:.86rem;line-height:1.55">` +
        `<span class="verdict matched">可以说</span><span style="color:var(--ink-soft)">${lv.may}</span>` +
        `<span class="verdict blocked">还不能说</span><span style="color:var(--ink-soft)">${lv.not}</span>` +
        `</div>`;
    }
    render();
  };
})();
