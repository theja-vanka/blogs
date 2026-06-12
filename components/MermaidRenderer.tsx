"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

// Darken a 6-digit hex color for dark mode: if lightness > 45% map it to L≈22%
// while keeping the same hue and capped saturation.
function darkifyHex(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 510; // lightness 0–1
  if (l <= 0.45) return hex;   // already dark, leave it

  const d = (max - min) / 255;
  let h = 0;
  if (d > 0) {
    if (max === r)      h = ((g - b) / 255 / d) % 6;
    else if (max === g) h = (b - r) / 255 / d + 2;
    else                h = (r - g) / 255 / d + 4;
    h = ((h * 60) + 360) % 360;
  }
  const s = (l === 0 || l === 1) ? 0 : d / (1 - Math.abs(2 * l - 1));

  const tL = 0.22;
  const tS = Math.min(s, 0.70);
  const C  = (1 - Math.abs(2 * tL - 1)) * tS;
  const X  = C * (1 - Math.abs((h / 60) % 2 - 1));
  const m  = tL - C / 2;
  const idx = Math.floor(h / 60) % 6;
  const rgb = [[C,X,0],[X,C,0],[0,C,X],[0,X,C],[X,0,C],[C,0,X]][idx];
  return '#' + rgb.map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
}

function prepareSource(source: string, isDark: boolean): string {
  // Strip any existing %%{init}%% directives so ours is the only one.
  // Mermaid processes all of them and the last one wins, so an embedded
  // "theme: base" would override our "theme: dark" otherwise.
  const stripped = source.replace(/^%%\{[\s\S]*?%%\s*\n?/gm, "").trimStart();

  const theme = isDark ? "dark" : "default";
  const directive = `%%{init: {"theme": "${theme}"}}%%\n`;
  if (!isDark) return directive + stripped;
  // Darken any inline light fill/stroke hex colours so they stay readable
  // on the dark page background.
  const adapted = stripped.replace(/#[0-9a-fA-F]{6}\b/g, darkifyHex);
  return directive + adapted;
}

export default function MermaidRenderer() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;
      if (cancelled) return;

      const isDark = document.documentElement.classList.contains("dark");
      const theme = isDark ? "dark" : "default";

      // Re-initialize with the current theme on every render pass so the
      // siteConfig is always in sync before any %%{init}%% merging happens.
      mermaid.initialize({
        startOnLoad: false,
        theme,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        flowchart: { useMaxWidth: true, htmlLabels: true },
        sequence:  { useMaxWidth: true },
      });
      // Flush mermaid's internal config cache so the new siteConfig applies.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (mermaid as any).setConfig === "function") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mermaid as any).setConfig({ theme });
      }

      // Restore any already-rendered wrappers back to <pre> so we can re-render.
      for (const wrapper of document.querySelectorAll<HTMLElement>("[data-mermaid-source]")) {
        const source = wrapper.getAttribute("data-mermaid-source") || "";
        const pre = document.createElement("pre");
        pre.className = "mermaid mermaid-js";
        pre.textContent = source;
        wrapper.replaceWith(pre);
      }

      const blocks = document.querySelectorAll<HTMLElement>("pre.mermaid-js");
      let i = 0;

      for (const pre of blocks) {
        if (cancelled) return;
        const source = (pre.textContent || "").trim();
        if (!source) continue;

        const id = `mermaid-${Date.now()}-${++i}`;
        try {
          const { svg } = await mermaid.render(id, prepareSource(source, isDark));
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-diagram not-prose";
          // Store the original source (without the directive) for re-renders.
          wrapper.setAttribute("data-mermaid-source", source);
          wrapper.innerHTML = svg;
          pre.replaceWith(wrapper);
        } catch (err) {
          console.warn("Mermaid render error:", err);
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [resolvedTheme]);

  return null;
}
