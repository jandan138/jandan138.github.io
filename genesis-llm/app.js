const outcomes = {
  execute: {
    label: "Contract accepted",
    title: "Enough supported information to compile",
    copy: "All required fields are present, typed, and within configured bounds. The compiler may construct a numeric configuration for Genesis.",
    gate: "schema + range",
    action: "compile configuration",
  },
  clarify: {
    label: "Information missing",
    title: "Ask for the smallest unresolved choice",
    copy: "The request is meaningful, but a required constraint remains unsupported. The system returns a targeted question instead of guessing a number.",
    gate: "missing constraint",
    action: "request clarification",
  },
  reject: {
    label: "Contract refused",
    title: "Stop before an invalid configuration exists",
    copy: "The proposed intent is outside the declared schema or configured bounds. The compiler rejects it before it can cross the simulation boundary.",
    gate: "schema or range violation",
    action: "return structured reason",
  },
};

const detail = document.querySelector("#outcome-detail");
const buttons = Array.from(document.querySelectorAll("[data-outcome]"));

function selectOutcome(button) {
  const outcome = button.dataset.outcome;
  const content = outcomes[outcome];

  buttons.forEach((candidate) => {
    const selected = candidate === button;
    candidate.classList.toggle("is-active", selected);
    candidate.setAttribute("aria-pressed", String(selected));
  });

  detail.className = `outcome-detail ${outcome}`;
  document.querySelector("#outcome-label").textContent = content.label;
  document.querySelector("#outcome-title").textContent = content.title;
  document.querySelector("#outcome-copy").textContent = content.copy;
  document.querySelector("#outcome-gate").textContent = content.gate;
  document.querySelector("#outcome-action").textContent = content.action;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => selectOutcome(button));
});
