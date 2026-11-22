/* ------------------------------------------------------------------
   HOW A SCAN WORKS — step tracing + an offline queue you can break.
   ------------------------------------------------------------------ */

export function initScan() {
  /* ---------- steps ---------- */

  const steps = Array.from(document.querySelectorAll("[data-step]"));
  const logRows = Array.from(document.querySelectorAll("[data-scope-log] p"));
  const stage = document.querySelector("[data-scan-stage]");
  let highest = 1;

  const activate = (index) => {
    highest = Math.max(highest, index);
    steps.forEach((step, i) => {
      step.classList.toggle("is-active", i + 1 === index);
    });
    logRows.forEach((row, i) => {
      row.classList.toggle("is-lit", i + 1 <= highest);
    });
    if (stage) stage.dataset.state = String(index);
  };

  if (steps.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const index = Number(entry.target.dataset.step);
            if (!Number.isNaN(index)) activate(index);
          });
        },
        { rootMargin: "-44% 0px -44% 0px", threshold: 0 }
      );
      steps.forEach((step) => io.observe(step));
    } else {
      steps.forEach((step) => step.classList.add("is-active"));
      logRows.forEach((row) => row.classList.add("is-lit"));
    }
  }

  /* ---------- offline demo ---------- */

  const root = document.querySelector("[data-offline]");
  if (!root) return;

  const toggle = root.querySelector("[data-offline-toggle]");
  const toggleText = root.querySelector("[data-offline-toggle-text]");
  const tap = root.querySelector("[data-offline-tap]");
  const reset = root.querySelector("[data-offline-reset]");
  const statusEl = root.querySelector("[data-console-status]");
  const queueEl = root.querySelector("[data-console-queue]");
  const dupesEl = root.querySelector("[data-console-dupes]");
  const rateEl = root.querySelector("[data-console-rate]");
  const logEl = root.querySelector("[data-console-log]");

  let online = true;
  let records = [];
  let synced = 0;
  let duplicates = 0;
  let busy = false;
  let seq = 481;
  let token = 0;
  let timers = [];

  const setStatus = (text) => {
    if (statusEl) statusEl.textContent = text;
  };

  const addLog = (text, fresh = true) => {
    if (!logEl) return;
    const p = document.createElement("p");
    p.textContent = text;
    if (fresh) p.classList.add("is-new");
    logEl.prepend(p);
    const lines = Array.from(logEl.children);
    lines.slice(4).forEach((line) => line.remove());
  };

  const trimDots = () => {
    if (!queueEl) return;
    while (queueEl.children.length > 22) {
      queueEl.firstElementChild?.remove();
    }
  };

  const updateRate = () => {
    if (!rateEl) return;
    const total = records.length;
    rateEl.textContent = total ? `${synced}/${total} · 100%` : "0/0 · 100%";
  };

  const updateDupes = () => {
    if (dupesEl) dupesEl.textContent = String(duplicates);
  };

  const addDot = (kind) => {
    const dot = document.createElement("i");
    dot.className = kind === "queued" ? "is-queued" : "is-synced";
    queueEl?.appendChild(dot);
    trimDots();
    return dot;
  };

  const clearTimers = () => {
    token += 1;
    timers.forEach((t) => window.clearTimeout(t));
    timers = [];
  };

  const tapScan = () => {
    if (busy) return;
    const id = `REC-0${seq}`;
    seq += 1;

    if (online) {
      const rec = { id, state: "synced", dot: addDot("synced") };
      records.push(rec);
      synced += 1;
      updateRate();
      setStatus(`ONLINE · ${synced} SYNCED`);
      addLog(`${id} · UPLOADED · 0.41s`);
      if (navigator.vibrate) navigator.vibrate(8);
    } else {
      const rec = { id, state: "queued", dot: addDot("queued") };
      records.push(rec);
      const queued = records.filter((r) => r.state === "queued").length;
      setStatus(`OFFLINE · ${queued} QUEUED`);
      addLog(`${id} · STORED ON DEVICE`);
      if (navigator.vibrate) navigator.vibrate([6, 40, 6]);
    }
  };

  const reconnect = () => {
    const pending = records.filter((r) => r.state === "queued");
    if (!pending.length) {
      setStatus("ONLINE · 0 QUEUED");
      addLog("WIFI RESTORED · NOTHING IN QUEUE");
      return;
    }

    busy = true;
    const myToken = token + 1;
    token = myToken;
    let done = 0;
    const total = pending.length;
    setStatus(`SYNCING 0/${total}`);

    pending.forEach((rec, i) => {
      const timer = window.setTimeout(() => {
        if (token !== myToken) return;
        rec.dot?.classList.add("is-flushing");

        const inner = window.setTimeout(() => {
          if (token !== myToken) return;
          rec.state = "synced";
          rec.dot?.classList.remove("is-queued", "is-flushing");
          rec.dot?.classList.add("is-synced");
          done += 1;
          synced += 1;
          updateRate();
          setStatus(`SYNCING ${done}/${total}`);
          addLog(`${rec.id} · SYNCED · SEQ CHECK OK`);

          if (done === total) {
            busy = false;
            setStatus(`SYNCED ${total} · DUPLICATES 0`);
            addLog(`FLUSH COMPLETE · ${total} RECORDS · 0 DUPLICATES`);
            updateDupes();
            if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
          }
        }, 260);
        timers.push(inner);
      }, i * 620);
      timers.push(timer);
    });
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      if (busy) return;
      online = !online;
      toggle.setAttribute("aria-pressed", String(!online));
      if (toggleText) toggleText.textContent = online ? "CUT THE WI-FI" : "RECONNECT WI-FI";

      if (!online) {
        setStatus(`OFFLINE · ${records.filter((r) => r.state === "queued").length} QUEUED`);
        addLog("WIFI LOST · QUEUE PROTECTED ON DEVICE");
      } else {
        reconnect();
      }
    });
  }

  if (tap) tap.addEventListener("click", tapScan);

  if (reset) {
    reset.addEventListener("click", () => {
      clearTimers();
      online = true;
      busy = false;
      records = [];
      synced = 0;
      duplicates = 0;
      seq = 481;
      token += 1;
      if (toggle) toggle.setAttribute("aria-pressed", "false");
      if (toggleText) toggleText.textContent = "CUT THE WI-FI";
      queueEl.innerHTML = "";
      updateRate();
      updateDupes();
      setStatus("ONLINE · 0 QUEUED");
      if (logEl) logEl.innerHTML = "<p>READY · WAITING FOR A FINGER</p>";
    });
  }

  updateRate();
}
