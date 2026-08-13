const authorityStates = {
  exact: {
    decision: "EXECUTE",
    decisionClass: "execute",
    source: "the user's exact value",
    why: "The requested field is bound to evidence already present in the instruction.",
  },
  strict: {
    decision: "CLARIFY",
    decisionClass: "clarify",
    source: "not yet supplied",
    why: "The phrase constrains the field but does not authorize one numeric point.",
  },
  declared: {
    decision: "EXECUTE",
    decisionClass: "execute",
    source: "the declared policy value",
    why: "Policy explicitly owns the missing field, so the compiler may bind its value.",
  },
};

const rail = document.querySelector("#authority-rail");
const buttons = Array.from(document.querySelectorAll("button[data-authority]"));
const decision = document.querySelector("#authority-decision");
const source = document.querySelector("#authority-source");
const why = document.querySelector("#authority-why");

function selectAuthority(button) {
  const authority = button.dataset.authority;
  const content = authorityStates[authority];

  buttons.forEach((candidate) => {
    const selected = candidate === button;
    candidate.classList.toggle("is-active", selected);
    candidate.setAttribute("aria-pressed", String(selected));
  });

  rail.dataset.authority = authority;
  decision.textContent = content.decision;
  decision.className = `decision ${content.decisionClass}`;
  source.textContent = content.source;
  why.textContent = content.why;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => selectAuthority(button));
});
