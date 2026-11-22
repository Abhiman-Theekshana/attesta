import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   THE DEVICE — parts open on scroll, battery slider does the maths.
   ------------------------------------------------------------------ */

export function initDevice({ reduce = false } = {}) {
  const parts = Array.from(document.querySelectorAll("[data-part]"));
  const stage = document.querySelector("[data-parts-stage]");

  if (parts.length && stage && !reduce) {
    const targets = parts.map((el) => ({
      x: (Number(el.dataset.x) || 0) * 0.26,
      y: (Number(el.dataset.y) || 0) * 0.3,
      rotation: Number(el.dataset.r) || 0,
    }));

    gsap.fromTo(
      parts,
      { x: 0, y: 0, rotation: 0 },
      {
        x: (i) => targets[i].x,
        y: (i) => targets[i].y,
        rotation: (i) => targets[i].rotation,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top 82%",
          end: "bottom 38%",
          scrub: 0.8,
        },
      }
    );
  }

  /* battery estimator */
  const range = document.querySelector("[data-battery-range]");
  const readout = document.querySelector("[data-battery-readout]");
  const lectures = document.querySelector("[data-battery-lectures]");

  if (!range) return;

  const update = () => {
    const pct = Number(range.value);
    const hours = pct * 0.12;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    const lectureCount = Math.max(0, Math.floor(hours / 2));

    if (readout) readout.textContent = `≈ ${h}h ${String(m).padStart(2, "0")}m`;
    if (lectures) {
      lectures.textContent =
        pct < 20
          ? "LOW — CHARGE BEFORE HALL 04"
          : lectureCount <= 1
          ? "ABOUT 1 LECTURE"
          : `ABOUT ${lectureCount} LECTURES`;
    }

    range.style.setProperty("--fill", `${((pct - 10) / 90) * 100}%`);
    range.setAttribute("aria-valuetext", `${pct} percent, about ${h} hours ${m} minutes`);
  };

  range.addEventListener("input", update);
  update();
}
