/* ------------------------------------------------------------------
   COMPARISON — ticks draw on scroll, a filter for the rows that
   actually differentiate Attesta, and column focusing on hover.
   ------------------------------------------------------------------ */

export function initCompare({ reduce = false } = {}) {
  const matrix = document.querySelector("[data-matrix]");
  if (!matrix) return;

  if (reduce) {
    matrix.classList.add("is-inview");
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        matrix.classList.add("is-inview");
        io.disconnect();
      },
      { threshold: 0.18 }
    );
    io.observe(matrix);
  } else {
    matrix.classList.add("is-inview");
  }

  const only = document.querySelector("[data-compare-only]");
  only?.addEventListener("change", () => {
    matrix.querySelectorAll("tbody tr").forEach((row) => {
      const diff = row.dataset.diff === "1";
      row.classList.toggle("is-filtered", only.checked && !diff);
    });
  });

  const heads = Array.from(matrix.querySelectorAll("thead th"));
  heads.forEach((head, index) => {
    if (index === 0) return;
    head.addEventListener("pointerenter", () => {
      matrix.dataset.col = String(index);
    });
    head.addEventListener("pointerleave", () => {
      delete matrix.dataset.col;
    });
    head.addEventListener("focusin", () => {
      matrix.dataset.col = String(index);
    });
    head.addEventListener("focusout", () => {
      delete matrix.dataset.col;
    });
  });
}
