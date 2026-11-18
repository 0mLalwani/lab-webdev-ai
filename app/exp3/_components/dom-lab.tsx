"use client";

import * as React from "react";

import { FILTERS, PROJECTS } from "../data";

/* ==========================================================
   AI-GENERATED VANILLA JS — direct DOM manipulation only.
   No React state is used in this component; every interaction
   below mutates the DOM with plain JavaScript APIs
   (addEventListener · querySelector · classList · createElement
   · IntersectionObserver · requestAnimationFrame · setInterval).
   ========================================================== */

export function DomLab() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  /* ---------- [1] Clock + greeting — setInterval → textContent ---------- */
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const clock = root.querySelector<HTMLElement>("[data-clock]");
    const greet = root.querySelector<HTMLElement>("[data-greeting]");
    if (!clock || !greet) return;

    const tick = () => {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const h = now.getHours();
      greet.textContent =
        h < 5
          ? "🌙 Burning the midnight oil"
          : h < 12
            ? "☀️ Good morning"
            : h < 17
              ? "🌤️ Good afternoon"
              : "🌆 Good evening";
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  /* ---------- [2] Counters — IntersectionObserver + rAF count-up ---------- */
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
    if (els.length === 0) return;

    const frames = new Map<HTMLElement, number>();

    const animate = (el: HTMLElement) => {
      const target = Number(el.dataset.count ?? 0);
      const suffix = el.dataset.suffix ?? "";
      const duration = 1400;
      const start = performance.now();
      const step = (t: number) => {
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${Math.round(target * eased).toLocaleString()}${suffix}`;
        if (p < 1) frames.set(el, requestAnimationFrame(step));
      };
      frames.set(el, requestAnimationFrame(step));
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target as HTMLElement);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      frames.forEach((frame) => cancelAnimationFrame(frame));
    };
  }, []);

  /* ---------- [3] Filter / sort / search — style.display + appendChild ---------- */
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const grid = root.querySelector<HTMLElement>("[data-grid]");
    const search = root.querySelector<HTMLInputElement>("[data-search]");
    const sort = root.querySelector<HTMLSelectElement>("[data-sort]");
    const empty = root.querySelector<HTMLElement>("[data-empty]");
    const chips = Array.from(
      root.querySelectorAll<HTMLButtonElement>("[data-filter]")
    );
    if (!grid || !search || !sort) return;

    let active = "all";

    const applyFilter = () => {
      const q = search.value.trim().toLowerCase();
      let visible = 0;
      Array.from(grid.children).forEach((child) => {
        const card = child as HTMLElement;
        const matchesQuery = (card.dataset.title ?? "")
          .toLowerCase()
          .includes(q);
        const matchesCategory = active === "all" || card.dataset.cat === active;
        const show = matchesQuery && matchesCategory;
        card.style.display = show ? "" : "none";
        if (show) visible += 1;
      });
      if (empty) empty.style.display = visible === 0 ? "block" : "none";
    };

    const applySort = () => {
      const cards = Array.from(grid.children) as HTMLElement[];
      cards.sort((a, b) => {
        if (sort.value === "az")
          return (a.dataset.title ?? "").localeCompare(b.dataset.title ?? "");
        if (sort.value === "za")
          return (b.dataset.title ?? "").localeCompare(a.dataset.title ?? "");
        if (sort.value === "old")
          return Number(a.dataset.year) - Number(b.dataset.year);
        return Number(b.dataset.year) - Number(a.dataset.year);
      });
      cards.forEach((card) => grid.appendChild(card));
      applyFilter();
    };

    const onChipClick = (event: Event) => {
      const btn = event.currentTarget as HTMLButtonElement;
      active = btn.dataset.filter ?? "all";
      chips.forEach((chip) => chip.classList.toggle("is-active", chip === btn));
      applyFilter();
    };

    search.addEventListener("input", applyFilter);
    sort.addEventListener("change", applySort);
    chips.forEach((chip) => chip.addEventListener("click", onChipClick));

    return () => {
      search.removeEventListener("input", applyFilter);
      sort.removeEventListener("change", applySort);
      chips.forEach((chip) => chip.removeEventListener("click", onChipClick));
    };
  }, []);

  /* ---------- [4] Modal — classList + Escape key + backdrop ---------- */
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const modal = root.querySelector<HTMLElement>("[data-modal]");
    if (!modal) return;
    const titleEl = modal.querySelector("[data-modal-title]");
    const descEl = modal.querySelector("[data-modal-desc]");
    const openers = Array.from(
      root.querySelectorAll<HTMLButtonElement>("[data-open]")
    );
    const closers = Array.from(
      modal.querySelectorAll<HTMLElement>("[data-close]")
    );

    const open = (btn: HTMLButtonElement) => {
      if (titleEl) titleEl.textContent = btn.dataset.open ?? "";
      if (descEl) descEl.textContent = btn.dataset.desc ?? "";
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    };
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const openerHandlers = openers.map((btn) => {
      const handler = () => open(btn);
      btn.addEventListener("click", handler);
      return { btn, handler };
    });
    closers.forEach((el) => el.addEventListener("click", close));
    window.addEventListener("keydown", onKeydown);

    return () => {
      openerHandlers.forEach(({ btn, handler }) =>
        btn.removeEventListener("click", handler)
      );
      closers.forEach((el) => el.removeEventListener("click", close));
      window.removeEventListener("keydown", onKeydown);
      document.body.style.overflow = "";
    };
  }, []);

  /* ---------- [5] Theme toggle — data-theme attribute on .exp3 ---------- */
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scope = root.closest(".exp3");
    const btn = root.querySelector<HTMLButtonElement>("[data-theme-toggle]");
    if (!scope || !btn) return;

    const onClick = () => {
      const isDark = scope.getAttribute("data-theme") === "dark";
      if (isDark) scope.removeAttribute("data-theme");
      else scope.setAttribute("data-theme", "dark");
      btn.textContent = isDark ? "🌙 Switch to dark" : "☀️ Switch to light";
    };

    btn.addEventListener("click", onClick);
    return () => btn.removeEventListener("click", onClick);
  }, []);

  /* ---------- [6] Toasts — createElement + timed removal ---------- */
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const btn = root.querySelector<HTMLButtonElement>("[data-toast-btn]");
    const tray = root.querySelector<HTMLElement>("[data-toasts]");
    if (!btn || !tray) return;

    let count = 0;
    const timers = new Set<number>();

    const onClick = () => {
      count += 1;
      const toast = document.createElement("div");
      toast.className = "lab-toast";
      toast.textContent = `Toast #${count} — created with document.createElement()`;
      tray.appendChild(toast);

      const remove = window.setTimeout(() => {
        toast.classList.add("is-leaving");
        const purge = window.setTimeout(() => toast.remove(), 300);
        timers.add(purge);
      }, 2400);
      timers.add(remove);
    };

    btn.addEventListener("click", onClick);
    return () => {
      btn.removeEventListener("click", onClick);
      timers.forEach((timer) => window.clearTimeout(timer));
      tray.replaceChildren();
    };
  }, []);

  /* ==========================================================
     Static markup — React renders it once; the vanilla JS
     above wires up all the behaviour.
     ========================================================== */
  return (
    <div ref={rootRef} className="mt-8 grid gap-6 lg:grid-cols-3">
      {/* ---- Live status ---- */}
      <section className="lab-panel">
        <h2>Live status</h2>
        <p className="hint">setInterval → textContent + rAF counters</p>
        <p data-greeting className="text-sm font-semibold">
          Hello
        </p>
        <p data-clock className="lab-clock">
          --:--:--
        </p>
        <div className="lab-counters mt-4">
          <div>
            <div className="value" data-count="24810" data-suffix="+">
              0
            </div>
            <div className="label">commits</div>
          </div>
          <div>
            <div className="value" data-count="1337">
              0
            </div>
            <div className="label">deploys</div>
          </div>
          <div>
            <div className="value" data-count="99" data-suffix="%">
              0
            </div>
            <div className="label">uptime</div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="lab-btn" data-toast-btn>
            🍞 Fire a toast
          </button>
          <button type="button" className="lab-btn" data-theme-toggle>
            🌙 Switch to dark
          </button>
        </div>
      </section>

      {/* ---- Modal demo ---- */}
      <section className="lab-panel lg:col-span-2">
        <h2>Modal windows</h2>
        <p className="hint">
          classList.add/remove · Escape key · backdrop click · body scroll lock
        </p>
        <div className="flex flex-wrap gap-2">
          {PROJECTS.slice(0, 3).map((project) => (
            <button
              key={project.title}
              type="button"
              className="lab-btn"
              data-open={project.title}
              data-desc={project.desc}
            >
              Open “{project.title}”
            </button>
          ))}
          <span className="lab-lead self-center text-xs">
            (press Esc to close)
          </span>
        </div>
      </section>

      {/* ---- Filter / sort / search grid ---- */}
      <section className="lab-panel lg:col-span-3">
        <h2>Filter · sort · search</h2>
        <p className="hint">
          input / change / click listeners → style.display + appendChild
          reordering
        </p>

        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input
            data-search
            type="search"
            className="lab-input"
            placeholder="Search projects…"
            aria-label="Search projects"
          />
          <select
            data-sort
            className="lab-select"
            aria-label="Sort projects"
            defaultValue="new"
          >
            <option value="new">Newest first</option>
            <option value="old">Oldest first</option>
            <option value="az">Name A→Z</option>
            <option value="za">Name Z→A</option>
          </select>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`lab-btn ${filter === "all" ? "is-active" : ""}`}
                data-filter={filter}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div data-grid className="lab-grid">
          {PROJECTS.map((project) => (
            <article
              key={project.title}
              className="lab-card"
              data-title={project.title}
              data-cat={project.cat}
              data-year={project.year}
            >
              <span className="emoji" aria-hidden="true">
                {project.emoji}
              </span>
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
              <div className="meta">
                <span className="tag">{project.cat}</span>
                <span>{project.year}</span>
              </div>
            </article>
          ))}
        </div>
        <p data-empty className="lab-empty" style={{ display: "none" }}>
          No projects match — try another search.
        </p>
      </section>

      {/* ---- Modal markup (hidden until opened) ---- */}
      <div
        data-modal
        className="lab-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Project details"
      >
        <div className="lab-modal-backdrop" data-close />
        <div className="lab-modal-card">
          <h3 data-modal-title className="text-lg font-bold">
            —
          </h3>
          <p
            data-modal-desc
            className="mt-2 text-sm"
            style={{ color: "var(--lab-muted)" }}
          >
            —
          </p>
          <button
            type="button"
            className="lab-btn lab-btn-primary mt-5"
            data-close
          >
            Close (Esc)
          </button>
        </div>
      </div>

      {/* ---- Toast tray ---- */}
      <div data-toasts className="lab-toasts" aria-live="polite" />
    </div>
  );
}



