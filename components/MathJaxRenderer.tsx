"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MathJax: any;
  }
}

// SVG output scales to fit the container — no scrollbars needed.
const MATHJAX_SRC =
  "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";

export default function MathJaxRenderer() {
  useEffect(() => {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise().catch(console.error);
      return;
    }

    window.MathJax = {
      tex: {
        inlineMath: [["\\(", "\\)"]],
        displayMath: [["\\[", "\\]"]],
        processEscapes: true,
        tags: "ams",
      },
      svg: {
        fontCache: "global",
        displayAlign: "center",
        displayIndent: "0",
      },
      options: {
        skipHtmlTags: ["script", "noscript", "style", "textarea", "pre"],
      },
      startup: { typeset: true },
    };

    if (!document.querySelector(`script[src="${MATHJAX_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = MATHJAX_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
