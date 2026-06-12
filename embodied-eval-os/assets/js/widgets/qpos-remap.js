/* qpos-remap — stage50 的经典 bug。
   把 MuJoCo 的 qpos 向量搬到 joint 排序不同的 Genesis：
   按 index 拷贝 → 互穿/clipping；按 joint name 重映射 → 正确，缺关节就 hard-fail。 */
(function () {
  window.EOSWidgets["qpos-remap"] = function (root) {
    // source(MuJoCo) 关节顺序与值
    const SRC = [["base_yaw", 0.3], ["L_shoulder", -0.8], ["L_elbow", 1.1], ["L_grip", 0.02], ["R_shoulder", -0.7]];
    // target(Genesis) 期望的关节顺序（不同！且少了 R_shoulder、多了 head_pan）
    const TGT = ["L_shoulder", "L_elbow", "base_yaw", "L_grip", "head_pan"];
    let mode = "index";
    const c = (n) => EOSW.c(n);
    const seg = EOSW.seg([{ label: "copy by index（bug）", value: "index" }, { label: "remap by joint name（fix）", value: "name" }], "index", (v) => { mode = v; render(); });
    const board = EOSW.el("div", { style: "margin-top:12px;display:grid;grid-template-columns:1fr auto 1fr;gap:6px 12px;align-items:center;font-family:var(--mono);font-size:.78rem" });
    const out = EOSW.el("div", { style: "margin-top:12px;font-size:.85rem" });
    root.appendChild(seg); root.appendChild(board); root.appendChild(out);

    function render() {
      board.innerHTML = `<div style="color:var(--sm);font-weight:600">MuJoCo qpos (source)</div><div></div><div style="color:var(--ev);font-weight:600">Genesis slot (target)</div>`;
      let bad = 0, missing = [];
      TGT.forEach((tname, i) => {
        let srcName, val, ok;
        if (mode === "index") {
          if (i < SRC.length) { [srcName, val] = SRC[i]; ok = srcName === tname; }
          else { srcName = "—"; val = "—"; ok = false; }
        } else {
          const hit = SRC.find((s) => s[0] === tname);
          if (hit) { srcName = hit[0]; val = hit[1]; ok = true; }
          else { srcName = "(无源关节)"; val = "—"; ok = false; missing.push(tname); }
        }
        if (!ok && mode === "index") bad++;
        const col = ok ? c("ok") : c("bad");
        board.innerHTML +=
          `<div style="color:var(--ink-soft)">${mode === "index" ? `idx ${i}: ${srcName}=${val}` : `${srcName}=${val}`}</div>` +
          `<div style="color:${col}">${ok ? "→" : "⤫"}</div>` +
          `<div>${tname} <span style="color:${col}">${ok ? "= " + val : "✗"}</span></div>`;
      });
      if (mode === "index") {
        out.innerHTML = `<span class="verdict mismatched">interpenetration / clipping</span> 按位置拷贝把 <span class="term">base_yaw</span> 的值灌进了 Genesis 的 <span class="term">L_elbow</span> 槽。关节角全错位，物体互穿、夹爪穿桌——而且<b>静默发生</b>，没有任何报错。这就是 stage50。`;
      } else {
        out.innerHTML = `<span class="verdict blocked">hard-fail</span> 按名字重映射，对得上的关节正确传值；遇到目标需要、源里却<b>没有</b>的关节（${missing.map((m) => `<span class="term">${m}</span>`).join("、")}）→ 立刻 <span class="term">blocked</span> 报 structured blocker，而不是悄悄填 0。这条教训后来升华成 core 的 <span class="term">generic-state-transfer-contract</span>。`;
      }
    }
    render();
  };
})();
