"use client";

import { useEffect } from "react";

const LINK_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

export default function HeadingAnchors() {
  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>(
      ".post-content h2[id], .post-content h3[id], .post-content h4[id]"
    );

    headings.forEach((heading) => {
      if (heading.querySelector(".heading-anchor")) return;
      const id = heading.getAttribute("id");
      if (!id) return;

      const anchor = document.createElement("a");
      anchor.href = `#${id}`;
      anchor.className = "heading-anchor";
      anchor.setAttribute("aria-label", "Link to this section");
      anchor.innerHTML = LINK_ICON;

      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        navigator.clipboard.writeText(url).catch(() => {});
        window.history.pushState(null, "", `#${id}`);
        heading.scrollIntoView({ behavior: "smooth" });
      });

      heading.appendChild(anchor);
    });
  }, []);

  return null;
}
