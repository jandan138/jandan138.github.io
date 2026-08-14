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

const heroVideo = document.querySelector("#hero-video");
const heroPlayback = document.querySelector("#hero-playback");
const playbackLabel = heroPlayback?.querySelector(".playback-label");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setPlaybackState(state) {
  if (!heroPlayback || !playbackLabel) return;
  const copy = {
    playing: ["Pause hero film", "Pause film"],
    paused: ["Play hero film", "Play film"],
    replay: ["Replay hero film", "Replay film"],
  }[state];
  heroPlayback.dataset.state = state;
  heroPlayback.setAttribute("aria-label", copy[0]);
  playbackLabel.textContent = copy[1];
}

function honorMotionPreference() {
  if (!heroVideo) return;
  if (reducedMotion.matches) {
    heroVideo.removeAttribute("autoplay");
    heroVideo.pause();
    heroVideo.currentTime = 0;
    setPlaybackState("paused");
  } else if (heroVideo.currentTime === 0 && heroVideo.paused) {
    heroVideo.play().then(() => setPlaybackState("playing")).catch(() => setPlaybackState("paused"));
  }
}

if (heroVideo && heroPlayback) {
  heroVideo.addEventListener("ended", () => {
    heroVideo.currentTime = 0;
    setPlaybackState("replay");
  });
  heroVideo.addEventListener("pause", () => {
    if (!heroVideo.ended) setPlaybackState("paused");
  });
  heroVideo.addEventListener("play", () => setPlaybackState("playing"));
  heroPlayback.addEventListener("click", () => {
    if (heroVideo.paused || heroVideo.ended) {
      if (heroVideo.ended) heroVideo.currentTime = 0;
      heroVideo.play().catch(() => setPlaybackState("paused"));
    } else {
      heroVideo.pause();
    }
  });
  reducedMotion.addEventListener?.("change", honorMotionPreference);
  honorMotionPreference();
}
