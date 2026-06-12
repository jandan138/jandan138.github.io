/* no-silent-fallback — 当一步缺测量时，两种处理方式的对照。
   切换"缺哪一项证据"，看错误做法（填 0 / success=true）vs 正确做法（blocked_*）。 */
(function () {
  window.EOSWidgets["no-silent-fallback"] = function (root) {
    const CASES = [
      { k: "contact force 缺失", status: "blocked_missing_measurement",
        wrong: 'normal_force = 0.0  # 看起来"没接触"', right: 'status = "blocked_missing_measurement"  # 缺测量，非零' },
      { k: "native state dump 取不到", status: "blocked_missing_state",
        wrong: 'state = {}  # 当成"空世界"', right: 'status = "blocked_missing_state"' },
      { k: "control 被 provider 拒绝", status: "blocked_control_rejected",
        wrong: 'task_success = True  # 假装动作生效', right: 'status = "blocked_control_rejected"' },
      { k: "render 帧没截到", status: "blocked_missing_artifact",
        wrong: 'render_capture_rate = 1.0', right: 'status = "blocked_missing_artifact"; render_capture_rate < 1.0' },
      { k: "optional SDK 没装", status: "blocked_optional_dependency",
        wrong: 'score = 1.0  # default pass', right: 'status = "blocked_optional_dependency"; not_evaluated' },
    ];
    let sel = 0;
    const c = (n) => EOSW.c(n);
    const seg = EOSW.seg(CASES.map((x, i) => ({ label: x.k, value: i })), 0, (v) => { sel = +v; render(); });
    const cols = EOSW.el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px" });
    const wrongCol = EOSW.el("div", { style: "border:1px solid var(--bad);border-radius:10px;overflow:hidden" });
    const rightCol = EOSW.el("div", { style: "border:1px solid var(--ok);border-radius:10px;overflow:hidden" });
    cols.appendChild(wrongCol); cols.appendChild(rightCol);
    root.appendChild(seg); root.appendChild(cols);
    const note = EOSW.el("div", { style: "margin-top:10px;font-size:.82rem;color:var(--ink-soft)" });
    root.appendChild(note);

    function head(txt, col) {
      return `<div style="padding:7px 12px;background:${col}1a;color:${col};font-weight:600;font-size:.82rem">${txt}</div>`;
    }
    function render() {
      const x = CASES[sel];
      wrongCol.innerHTML = head("✗ silent fallback（禁止）", c("bad")) +
        `<pre style="margin:0;padding:12px 14px;font-family:var(--mono);font-size:.78rem;color:var(--ink);white-space:pre-wrap">${x.wrong}</pre>`;
      rightCol.innerHTML = head("✓ explicit blocked status", c("ok")) +
        `<pre style="margin:0;padding:12px 14px;font-family:var(--mono);font-size:.78rem;color:var(--ink);white-space:pre-wrap">${x.right}</pre>`;
      note.innerHTML = `缺证据 → 显式状态 <span class="term">${x.status}</span>，<b>绝不</b>变成 0 / [] / success=true / default pass。报告必须带分母（如 <code>render_capture_rate</code>、<code>control_acceptance_rate</code>），让"没测到"和"测到是 0"永远分得清。`;
    }
    render();
  };
})();
