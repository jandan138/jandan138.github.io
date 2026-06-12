/* tensorstate-trap — 同形状 ≠ 可比。
   两个后端都给一个 17 维向量，但每个 index 的语义不同。
   "按 index 对齐"会把不相干的量两两相减。 */
(function () {
  window.EOSWidgets["tensorstate-trap"] = function (root) {
    const A = ["base_x", "base_y", "base_yaw", "L_j0", "L_j1", "L_j2", "L_grip", "R_j0", "R_j1"];
    const B = ["L_j0", "L_j1", "L_j2", "R_j0", "R_j1", "base_x", "base_y", "base_yaw", "R_grip"];
    let mode = "index";
    const c = (n) => EOSW.c(n);
    const seg = EOSW.seg([{ label: "按 index 对齐（裸 tensor 的诱惑）", value: "index" }, { label: "按 semantic name 对齐", value: "name" }], "index", (v) => { mode = v; render(); });
    const board = EOSW.el("div", { style: "margin-top:12px;display:grid;grid-template-columns:auto 1fr 1fr;gap:4px 14px;align-items:center;font-family:var(--mono);font-size:.78rem" });
    const note = EOSW.el("div", { style: "margin-top:12px;font-size:.84rem;color:var(--ink-soft)" });
    root.appendChild(seg); root.appendChild(board); root.appendChild(note);

    function render() {
      board.innerHTML = `<div></div><div style="color:var(--accent);font-weight:600">Backend A</div><div style="color:var(--sm);font-weight:600">Backend B (index i)</div>`;
      let mismatches = 0;
      A.forEach((nameA, i) => {
        let partner, ok;
        if (mode === "index") { partner = B[i]; ok = nameA === B[i]; }
        else { const j = B.indexOf(nameA); partner = j >= 0 ? `${nameA} (B idx ${j})` : "—— (B 无此分量)"; ok = j >= 0; }
        if (!ok) mismatches++;
        const col = ok ? c("ok") : c("bad");
        board.innerHTML += `<div style="color:var(--ink-faint)">i=${i}</div>` +
          `<div>${nameA}</div>` +
          `<div style="color:${col}">${partner} ${ok ? "✓" : "✗"}</div>`;
      });
      note.innerHTML = mode === "index"
        ? `<span class="verdict mismatched">${mismatches}/9 错配</span> 同样是 9 维向量，按 index 对齐却把 <span class="term">base_yaw</span> 减到了 <span class="term">L_j2</span> 上。形状相同<b>什么都证明不了</b>——不证明 component inventory 相同、ordering 相同、frame/unit/sign 一致。这正是 EOS 拒绝把裸 <span class="term">TensorState</span> 当评测真相的原因。`
        : `<span class="verdict matched">语义对齐</span> 只有先有 scenario 拥有的 <span class="term">semantic component map</span>（按名字而非位置），跨后端的量才谈得上可比。注意 B 比 A 多/少的分量会显式暴露，而不是被悄悄对齐。`;
    }
    render();
  };
})();
