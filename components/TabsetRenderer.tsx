"use client";

import { useEffect } from "react";

export default function TabsetRenderer() {
  useEffect(() => {
    // ── Tab panels ──────────────────────────────────────────────────
    document.querySelectorAll<HTMLElement>(".panel-tabset").forEach((tabset) => {
      const links = Array.from(tabset.querySelectorAll<HTMLElement>(".nav-link"));
      const panes = Array.from(tabset.querySelectorAll<HTMLElement>(".tab-pane"));

      links.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const target = link.getAttribute("data-bs-target");
          if (!target) return;

          links.forEach((l) => {
            l.classList.remove("active");
            l.setAttribute("aria-selected", "false");
          });
          link.classList.add("active");
          link.setAttribute("aria-selected", "true");

          panes.forEach((pane) => pane.classList.remove("active"));
          tabset.querySelector<HTMLElement>(target)?.classList.add("active");
        });
      });
    });

    // ── Collapsible callouts ─────────────────────────────────────────
    document.querySelectorAll<HTMLElement>(".callout-collapse").forEach((callout) => {
      const header = callout.querySelector<HTMLElement>(".callout-header");
      if (!header) return;

      // Quarto marks collapsed callouts with .collapsed on the callout div
      // and .show on the body. We sync to our own toggle via .collapsed class.
      const body = callout.querySelector<HTMLElement>(".callout-body-container");
      if (!body) return;

      // If Quarto emitted without .show, start collapsed
      const startsOpen = callout.querySelector(".callout-collapse-contents.show, .callout-body-container") !== null &&
        !callout.classList.contains("collapsed");

      if (!startsOpen) callout.classList.add("collapsed");

      header.style.cursor = "pointer";
      header.addEventListener("click", () => {
        callout.classList.toggle("collapsed");
      });
    });
  }, []);

  return null;
}
