/* capability-radar — 五条能力轴雷达对比。
   axes: task execution / world prediction / safety / generalization / planning。
   勾选不同模型；同样"平均分"画像可截然不同。数值为示意。 */
(function () {
  window.EOSWidgets["capability-radar"] = function (root) {
    const AXES = ["task\nexecution", "world\nprediction", "safety\nreasoning", "generalization", "planning\nusefulness"];
    const MODELS = [
      { id: "A", name: "Actor-VLA", color: "accent", on: true, v: [0.82, 0.31, 0.40, 0.55, 0.28] },
      { id: "B", name: "World-Model", color: "ev", on: true, v: [0.44, 0.78, 0.62, 0.66, 0.71] },
      { id: "C", name: "Safety-Critic", color: "sm", on: false, v: [0.30, 0.58, 0.85, 0.49, 0.63] },
    ];
    const c = (n) => EOSW.c(n);

    const cv = EOSW.el("canvas", { width: 520, height: 360 });
    const ctrls = EOSW.el("div", { class: "ctrl-row", style: "margin-top:12px" });
    MODELS.forEach((m) => {
      const chip = EOSW.el("button", { class: "chip" + (m.on ? " on" : "") },
        `<span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${c(m.color)}"></span>${m.name}`);
      chip.addEventListener("click", () => { m.on = !m.on; chip.classList.toggle("on", m.on); draw(); });
      ctrls.appendChild(chip);
    });
    root.appendChild(cv); root.appendChild(ctrls);

    function draw() {
      const ctx = cv.getContext("2d");
      const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2 + 6, R = 120;
      ctx.clearRect(0, 0, W, H);
      ctx.font = "12px Inter, sans-serif";
      const N = AXES.length;
      // grid rings
      ctx.strokeStyle = c("border-strong"); ctx.fillStyle = c("ink-faint");
      for (let ring = 1; ring <= 4; ring++) {
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = (Math.PI * 2 * i) / N - Math.PI / 2;
          const r = (R * ring) / 4;
          const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.globalAlpha = 0.5; ctx.stroke(); ctx.globalAlpha = 1;
      }
      // spokes + labels
      for (let i = 0; i < N; i++) {
        const a = (Math.PI * 2 * i) / N - Math.PI / 2;
        const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        ctx.strokeStyle = c("border"); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = c("ink-soft"); ctx.textAlign = "center";
        const lx = cx + (R + 26) * Math.cos(a), ly = cy + (R + 22) * Math.sin(a);
        AXES[i].split("\n").forEach((ln, k) => ctx.fillText(ln, lx, ly + k * 13 - 6));
      }
      // models
      MODELS.filter((m) => m.on).forEach((m) => {
        const col = c(m.color);
        ctx.beginPath();
        m.v.forEach((val, i) => {
          const a = (Math.PI * 2 * i) / N - Math.PI / 2;
          const r = R * val;
          const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = col + "26"; ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
        m.v.forEach((val, i) => {
          const a = (Math.PI * 2 * i) / N - Math.PI / 2;
          const x = cx + R * val * Math.cos(a), y = cy + R * val * Math.sin(a);
          ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fillStyle = col; ctx.fill();
        });
      });
    }
    draw();
    window.addEventListener("resize", draw);
  };
})();
