/* divergence-trace — paired dynamic trace：两引擎沿时间何处首次分叉。
   拖时间轴，看每条轴的 verdict 何时从 matched 翻成 mismatched / blocked。 */
(function () {
  window.EOSWidgets["divergence-trace"] = function (root) {
    // 每条轴：分叉步 d（null = 全程 matched），blocked = 该轴根本没测到
    const AXES = [
      { name: "robot_action_replay", d: null },
      { name: "tube_lift", d: 28 },
      { name: "finger_cap_contact", d: 17 },
      { name: "tube_cap_body_retention", d: 12 },
      { name: "contact_force", d: null, blocked: true },
    ];
    const T = 40;
    let t = 24;
    const c = (n) => EOSW.c(n);
    const cv = EOSW.el("canvas", { width: 520, height: 200 });
    const sl = EOSW.slider("step t", 0, T, 1, t, (v) => { t = v; render(); });
    const rows = EOSW.el("div", { style: "margin-top:10px;display:flex;flex-direction:column;gap:5px" });
    const summary = EOSW.el("div", { style: "margin-top:8px;font-size:.84rem;color:var(--ink-soft)" });
    root.appendChild(cv); root.appendChild(sl.wrap); root.appendChild(rows); root.appendChild(summary);

    function curve(d, blocked, eng) {
      // 两条曲线在 d 之前重合，之后 genesis 偏离
      const pts = [];
      for (let i = 0; i <= T; i++) {
        let base = 0.5 + 0.32 * Math.sin(i / 5);
        if (eng === "g" && d != null && i > d) base += 0.05 * (i - d);
        pts.push(EOSW.clamp(base, 0.02, 0.98));
      }
      return pts;
    }
    function render() {
      sl.setVal(t);
      const ctx = cv.getContext("2d"), W = cv.width, H = cv.height, pad = 24;
      ctx.clearRect(0, 0, W, H);
      const X = (i) => pad + (W - 2 * pad) * i / T, Y = (v) => H - pad - (H - 2 * pad) * v;
      // 只画 tube_lift 这一条代表轴
      const ax = AXES[1];
      [["mu", c("sm")], ["g", c("ev")]].forEach(([eng, col]) => {
        const pts = curve(ax.d, false, eng);
        ctx.beginPath(); pts.forEach((v, i) => { const x = X(i), y = Y(v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
      });
      ctx.lineWidth = 1;
      // 时间游标
      ctx.strokeStyle = c("accent"); ctx.beginPath(); ctx.moveTo(X(t), pad - 6); ctx.lineTo(X(t), H - pad); ctx.stroke();
      // 首次分叉
      const firstDiv = Math.min(...AXES.filter((a) => a.d != null).map((a) => a.d));
      ctx.strokeStyle = c("bad"); ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(X(firstDiv), pad - 6); ctx.lineTo(X(firstDiv), H - pad); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = c("bad"); ctx.font = "11px Inter"; ctx.fillText("first divergence", X(firstDiv) - 30, pad - 9);
      ctx.fillStyle = c("ink-faint"); ctx.fillText("tube_lift: MuJoCo(紫) vs Genesis(绿)", pad, H - 6);

      rows.innerHTML = "";
      AXES.forEach((a) => {
        let v, cls;
        if (a.blocked) { v = "blocked"; cls = "blocked"; }
        else if (a.d == null || t < a.d) { v = "matched"; cls = "matched"; }
        else { v = "mismatched"; cls = "mismatched"; }
        const r = EOSW.el("div", { style: "display:flex;justify-content:space-between;align-items:center;font-size:.8rem" });
        r.innerHTML = `<span style="font-family:var(--mono);color:var(--ink-soft)">${a.name}</span><span class="verdict ${cls}">${v}</span>`;
        rows.appendChild(r);
      });
      summary.innerHTML = `当前 t=${t}。最早分叉在 step <b>${firstDiv}</b>（<span class="term">tube_cap_body_retention</span>）。<span class="term">contact_force</span> 全程 <span class="verdict blocked">blocked</span>——没测到，不是"对得上"。这张图是<b>成功的诊断</b>：它说清两引擎在哪一致、哪分叉、哪没法比——但<b>不</b>声称 parity。`;
    }
    render();
  };
})();
