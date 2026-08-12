export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Quarto's rendered HTML omits alt text on <img> tags with no caption.
// Fill those in with a fallback so no image ships without alt text.
export function ensureImageAlt(html: string, fallbackAlt: string): string {
  const escaped = fallbackAlt.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  return html.replace(/<img\b([^>]*)>/g, (full, attrs: string) =>
    /\balt\s*=/.test(attrs) ? full : `<img${attrs} alt="${escaped}">`
  );
}
