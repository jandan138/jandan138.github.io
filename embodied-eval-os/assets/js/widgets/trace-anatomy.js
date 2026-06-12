/* trace-anatomy — 交互式浏览一条 EpisodeTrace。
   点高亮的字段看它是什么、为什么重要。signature 字段：claim_boundary / privileged。 */
(function () {
  window.EOSWidgets["trace-anatomy"] = function (root) {
    const NOTES = {
      episode_id: "一条 trace = 一个 episode。绝不把多个 episode 合并进一个 trace 对象。",
      backend_profile_id: "证据归属于一个<i>具体组合</i>的后端，而不是“某个仿真器”。",
      backend_components: "六大组件被强制写进每条 trace：platform / physics / renderer / sensors / control / process_runtime。",
      versions: "repo commit、spec/profile/asset 版本、model hash、seed……没有这些元数据，trace 不算有效证据。",
      privileged_state_policy: "默认 model 输入<b>不含</b> privileged state。要喂特权信息必须显式标注 benchmark 模式。",
      claim_boundary: "EOS 的签名字段：这条 trace 证明了什么、不证明什么。默认“只是 trace 证据，不主张仿真保真或现实安全”。",
      privileged_state_visible_to_model: "逐步记录：这一步模型有没有看到特权状态。让“作弊”无所遁形。",
      physical_state_projection: "L4：simulator-neutral 的物理投影。",
      task_semantic_state: "L5：场景拥有的语义（finger_cap_contact 等）。core 只当 payload 存。",
      episode_metrics: "聚合的逐 episode 指标。task_success 只有经 accepted evaluator outcome 才可信。",
    };
    const c = (n) => EOSW.c(n);
    const TRACE = [
      ['{', 0, null],
      ['"episode_id": "ep_000042",', 1, 'episode_id'],
      ['"task_id": "smoke.move_to_threshold",', 1, null],
      ['"scenario_pack": "smoke",', 1, null],
      ['"backend_profile_id": "dummy_backend",', 1, 'backend_profile_id'],
      ['"seed": 42,', 1, null],
      ['"versions": {"repo_commit": "5d553e4", "task_spec": "v1", ...},', 1, 'versions'],
      ['"backend_components": {"platform": "...", "physics": "...", ...},', 1, 'backend_components'],
      ['"privileged_state_policy": "model_input_excludes_privileged_state",', 1, 'privileged_state_policy'],
      ['"claim_boundary": "Trace evidence only; no simulator fidelity ...",', 1, 'claim_boundary'],
      ['"steps": [', 1, null],
      ['{', 2, null],
      ['"step_index": 0, "time_s": 0.0,', 3, null],
      ['"observation": {...}, "action": [...],', 3, null],
      ['"physical_state_projection": {...},', 3, 'physical_state_projection'],
      ['"task_semantic_state": {...},', 3, 'task_semantic_state'],
      ['"metric_results": {"reward": 0.1},', 3, null],
      ['"privileged_state_visible_to_model": false', 3, 'privileged_state_visible_to_model'],
      ['}, ...', 2, null],
      ['],', 1, null],
      ['"episode_metrics": {"task_success": true}', 1, 'episode_metrics'],
      ['}', 0, null],
    ];
    const wrap = EOSW.el("div", { style: "display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start" });
    const codebox = EOSW.el("div", { style: "flex:1;min-width:280px;background:var(--code-bg);border-radius:10px;padding:12px 10px;font-family:var(--mono);font-size:.78rem;line-height:1.7;overflow-x:auto" });
    const panel = EOSW.el("div", { style: "flex:0 0 230px;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;font-size:.84rem;color:var(--ink-soft);min-height:90px" });
    panel.innerHTML = "点左边<b>高亮</b>的字段看它的作用 →";
    TRACE.forEach(([txt, indent, key]) => {
      const line = EOSW.el("div", { style: `padding-left:${indent * 14}px;color:${key ? c("ok") : "#9aa0bf"};${key ? "cursor:pointer" : ""};border-radius:4px` });
      line.textContent = txt;
      if (key) {
        line.addEventListener("click", () => {
          codebox.querySelectorAll("div").forEach((d) => (d.style.background = "transparent"));
          line.style.background = c("ok") + "26";
          panel.innerHTML = `<div style="font-family:var(--mono);color:${c("ok")};font-size:.74rem;margin-bottom:4px">${key}</div>${NOTES[key]}`;
        });
        line.addEventListener("mouseenter", () => { if (!line.style.background.includes("rgb")) line.style.background = c("ok") + "14"; });
        line.addEventListener("mouseleave", () => { if (line.style.background === c("ok") + "14") line.style.background = "transparent"; });
      }
      codebox.appendChild(line);
    });
    wrap.appendChild(codebox); wrap.appendChild(panel); root.appendChild(wrap);
  };
})();
