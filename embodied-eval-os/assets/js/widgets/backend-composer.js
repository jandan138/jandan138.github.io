/* backend-composer — 把六大组件组合成一个 backend profile。
   换任意组件，看它能/不能支持哪种"只改一个组件"的对比实验。 */
(function () {
  window.EOSWidgets["backend-composer"] = function (root) {
    const COMP = [
      { key: "platform", opts: ["isaac_sim", "mujoco", "genesis", "real_robot_runtime"] },
      { key: "physics", opts: ["physx", "newton", "mujoco_physics", "genesis_physics", "semantic_proxy", "real_world"] },
      { key: "renderer", opts: ["isaac_rtx", "blender_cycles", "mujoco_renderer", "genesis_renderer", "real_camera", "none"] },
      { key: "sensors", opts: ["rgb", "rgb+depth", "rgb+depth+force", "proprioception_only"] },
      { key: "control", opts: ["joint_position", "ee_delta", "action_chunk", "ros_control"] },
      { key: "process_runtime", opts: ["none", "reduced_liquid_model", "device_state_machine", "hazard_event_generator"] },
    ];
    const c = (n) => EOSW.c(n);
    const state = {}; COMP.forEach((x) => (state[x.key] = x.opts[0]));
    const ref = JSON.parse(JSON.stringify(state)); // 用于"只改一个组件"判定

    const grid = EOSW.el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:10px 16px" });
    COMP.forEach((x) => {
      const wrap = EOSW.el("div", { class: "ctrl", style: "width:100%" });
      wrap.appendChild(EOSW.el("label", null, `<span style="font-family:var(--mono);color:var(--accent)">${x.key}</span>`));
      const sel = EOSW.el("select", { style: "width:100%;padding:5px 8px;border:1px solid var(--border-strong);border-radius:7px;background:var(--surface);color:var(--ink);font-family:var(--mono);font-size:.8rem" });
      x.opts.forEach((o) => sel.appendChild(EOSW.el("option", { value: o }, o)));
      sel.addEventListener("change", () => { state[x.key] = sel.value; render(); });
      wrap.appendChild(sel); grid.appendChild(wrap);
    });
    const out = EOSW.el("div", { style: "margin-top:14px" });
    const resetBtn = EOSW.el("button", { class: "btn", style: "margin-top:10px" }, "把当前设为参照基线");
    resetBtn.addEventListener("click", () => { Object.assign(ref, JSON.parse(JSON.stringify(state))); render(); });
    root.appendChild(grid); root.appendChild(out); root.appendChild(resetBtn);

    function render() {
      const changed = COMP.map((x) => x.key).filter((k) => state[k] !== ref[k]);
      const profile = COMP.map((x) => `  ${x.key}: ${state[x.key]}`).join("\n");
      let verdict;
      if (changed.length === 0) verdict = `<span class="verdict neutral">= 基线</span> 与参照完全相同。`;
      else if (changed.length === 1) verdict = `<span class="verdict matched">干净的对比</span> 只改了 <span class="term">${changed[0]}</span>——这正是 EOS 要求的：把 task / metric 固定，只动一个组件，结论才归因得清。`;
      else verdict = `<span class="verdict mismatched">混淆的对比</span> 同时改了 ${changed.length} 个组件（${changed.join("、")}）。结果的差异无法归因到任何单一组件——别说"Compare Isaac vs MuJoCo"。`;
      out.innerHTML =
        `<div class="code" data-lang="yaml" style="margin:0"><div class="code-h"><span class="fn">backend_profile (composed)</span></div><pre><code style="color:var(--code-ink)">platform / physics / renderer / sensors / control / process_runtime\n${profile}</code></pre></div>` +
        `<div style="margin-top:10px;font-size:.86rem;color:var(--ink-soft)">${verdict}</div>`;
    }
    render();
  };
})();
