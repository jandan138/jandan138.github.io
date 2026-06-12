/* state-normalization — 三层状态：L3 measure → L4 project → L5 semantics。
   一步步看同一抓取瞬间，怎样从 backend 原生量，变成 simulator-neutral 投影，
   再变成场景语义（finger_cap_contact …）。 */
(function () {
  window.EOSWidgets["state-normalization"] = function (root) {
    const STAGES = [
      { k: "L3 · RuntimeMeasurementSnapshot", col: "interactive", sub: "measure() —— 原生、未归一化、capability-scoped",
        body:
`backend_profile_id: mujoco_autobio
native_qpos: [0.00, -0.31, 0.77, ... ]   # 17 维，MuJoCo 自己的排序
native_body_ids: {12: "...", 13: "...", 27: "..."}
contacts_native: <opaque solver dump ref>
coverage: {pose: exact, force: blocked_missing_measurement}` },
      { k: "L4 · PhysicalStateProjection", col: "ev", sub: "project_physical_state() —— simulator-neutral 归一化",
        body:
`robots:   {lift2: {ee_pose: [[x,y,z],[qx,qy,qz,qw]] × 2}}
joints:   {left_finger: {q: 0.012, qd: -0.04}, ...}
objects:  {tube_cap: {pose: [...]}, tube_body: {pose: [...]}}
contacts: [{body_a: left_finger, body_b: tube_cap, normal_force: <blocked>}]` },
      { k: "L5 · TaskSemanticState", col: "claim", sub: "scenario pack 拥有 —— 任务语义",
        body:
`process_state:   {pickup_phase: "grasp"}
procedure_state: {finger_cap_contact: true,
                  tube_cap_body_retention: "holding"}
hazard_events:   []
# 注意：contact_force 缺测量 → 不是 false，而是 blocked。` },
    ];
    let sel = 0;
    const c = (n) => EOSW.c(n);
    const flow = EOSW.el("div", { style: "display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:12px" });
    const btns = STAGES.map((s, i) => {
      const b = EOSW.el("button", { class: "chip", style: "font-size:.76rem" }, s.k.split(" · ")[0]);
      b.addEventListener("click", () => { sel = i; render(); });
      flow.appendChild(b);
      if (i < STAGES.length - 1) flow.appendChild(EOSW.el("span", { style: "color:var(--ink-faint)" }, "→"));
      return b;
    });
    const panel = EOSW.el("div");
    const nav = EOSW.el("div", { class: "ctrl-row", style: "margin-top:10px" });
    const prev = EOSW.el("button", { class: "btn" }, "← 上一层");
    const next = EOSW.el("button", { class: "btn primary" }, "下一层 →");
    prev.addEventListener("click", () => { sel = Math.max(0, sel - 1); render(); });
    next.addEventListener("click", () => { sel = Math.min(2, sel + 1); render(); });
    nav.appendChild(prev); nav.appendChild(next);
    root.appendChild(flow); root.appendChild(panel); root.appendChild(nav);

    function render() {
      btns.forEach((b, i) => b.classList.toggle("on", i === sel));
      const s = STAGES[sel];
      panel.innerHTML =
        `<div class="code" data-lang="yaml" style="margin:0;border-left:3px solid ${c(s.col)}"><div class="code-h"><span class="fn" style="color:${c(s.col)}">${s.k}</span><span style="color:var(--ink-faint);font-size:.72rem">${s.sub}</span></div><pre><code style="color:var(--code-ink)">${s.body.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre></div>`;
      prev.disabled = sel === 0; next.disabled = sel === 2;
      prev.style.opacity = sel === 0 ? .4 : 1; next.style.opacity = sel === 2 ? .4 : 1;
    }
    render();
  };
})();
