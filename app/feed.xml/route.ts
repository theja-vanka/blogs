import { getAllPosts, getPost } from "@/lib/posts";

export const dynamic = "force-static";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://theja-vanka.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function absolutifyImages(content: string, slugPath: string): string {
  return content.replace(
    /(<img[^>]*\ssrc=")(?!https?:|\/|data:)([^"]+)"/g,
    `$1https://theja-vanka.github.io${BASE_PATH}/posts/${slugPath}/$2"`
  );
}

export function GET() {
  const posts = getAllPosts().filter((p) => p.date);

  const items = posts
    .map((p) => {
      const full = getPost(p.slug);
      const content = full ? absolutifyImages(full.content, p.slugPath) : "";
      const cats = p.categories.map((c) => `      <category>${c}</category>`).join("\n");
      return `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE_URL}/posts/${p.slugPath}/</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${p.slugPath}/</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      ${p.description ? `<description><![CDATA[${p.description}]]></description>` : ""}
${cats}
      ${content ? `<content:encoded><![CDATA[${content}]]></content:encoded>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Krishnatheja Vanka</title>
    <link>${SITE_URL}/</link>
    <description>Applied Scientist and Machine Learning Engineer writing about ML research, model deployment, and production systems.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
