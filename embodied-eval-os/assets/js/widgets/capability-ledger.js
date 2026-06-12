/* capability-ledger — 能力/就绪矩阵：axis-status，不是分数。
   切换 registry(打算支持) vs readiness(这一次实测)；点单元格循环状态。 */
(function () {
  window.EOSWidgets["capability-ledger"] = function (root) {
    const STATUSES = ["exact", "approximate", "partial", "read_only", "opaque_only", "unsupported", "blocked"];
    const COL = { exact: "ok", approximate: "ok", partial: "claim", read_only: "neutral", opaque_only: "neutral", unsupported: "neutral", blocked: "bad" };
    const AXES = ["rigid_body pose", "articulation qpos", "contact list", "contact force", "rgb frame", "native state dump"];
    const BACKENDS = ["semantic_proxy", "mujoco_autobio"];
    // registry = 声明; readiness = 实测（更保守）
    const DATA = {
      registry: {
        semantic_proxy: ["approximate", "approximate", "unsupported", "unsupported", "unsupported", "opaque_only"],
        mujoco_autobio: ["exact", "exact", "exact", "approximate", "partial", "read_only"],
      },
      readiness: {
        semantic_proxy: ["approximate", "approximate", "unsupported", "unsupported", "unsupported", "unsupported"],
        mujoco_autobio: ["exact", "exact", "exact", "blocked", "blocked", "read_only"],
      },
    };
    let view = "registry";
    const c = (n) => EOSW.c(n);
    const seg = EOSW.seg([{ label: "registry · 打算支持", value: "registry" }, { label: "readiness · 这一次实测", value: "readiness" }], "registry", (v) => { view = v; render(); });
    const tableWrap = EOSW.el("div", { style: "margin-top:12px;overflow-x:auto" });
    const note = EOSW.el("div", { style: "margin-top:10px;font-size:.82rem;color:var(--ink-soft)" });
    root.appendChild(seg); root.appendChild(tableWrap); root.appendChild(note);

    function cycle(b, i) {
      const arr = DATA[view][b];
      arr[i] = STATUSES[(STATUSES.indexOf(arr[i]) + 1) % STATUSES.length];
      render();
    }
    function render() {
      let html = `<table class="ledger" style="margin:0"><thead><tr><th>evidence axis</th>`;
      BACKENDS.forEach((b) => (html += `<th>${b}</th>`));
      html += `</tr></thead><tbody>`;
      AXES.forEach((ax, i) => {
        html += `<tr><td>${ax}</td>`;
        BACKENDS.forEach((b) => {
          const st = DATA[view][b][i], col = c(COL[st]);
          html += `<td><button data-b="${b}" data-i="${i}" style="cursor:pointer;border:1px solid ${col};color:${col};background:${col}1a;border-radius:6px;padding:2px 8px;font-family:var(--mono);font-size:.72rem">${st}</button></td>`;
        });
        html += `</tr>`;
      });
      html += `</tbody></table>`;
      tableWrap.innerHTML = html;
      tableWrap.querySelectorAll("button").forEach((btn) =>
        btn.addEventListener("click", () => cycle(btn.dataset.b, +btn.dataset.i)));
      const blocked = BACKENDS.flatMap((b) => DATA[view][b]).filter((s) => s === "blocked").length;
      note.innerHTML = view === "readiness"
        ? `这是 <span class="term">backend readiness ledger</span>：本次<i>实测</i>到/被 block 了什么。注意 <span class="verdict blocked">blocked</span> 不是"0 分"——是"这次没测到"。即使整列全绿，也<b>不</b>代表 task success / backend parity / 官方复现。`
        : `这是 <span class="term">runtime capability registry</span>：provider <i>声明</i>打算支持什么。它是规划元数据，不是已发生的证据——真正算数的是 readiness。`;
    }
    render();
  };
})();
