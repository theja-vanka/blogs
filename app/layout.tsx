import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://theja-vanka.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;

export const metadata: Metadata = {
  title: { default: "Krishnatheja Vanka", template: "%s | Krishnatheja Vanka" },
  description: "Technical writing on ML, Python, and deployment — by Krishnatheja Vanka.",
  authors: [{ name: "Krishnatheja Vanka" }],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  openGraph: {
    type: "website",
    siteName: "Krishnatheja Vanka",
    locale: "en_US",
    images: [{ url: `${SITE_URL}/profile.jpg`, width: 400, height: 400, alt: "Krishnatheja Vanka" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen bg-white dark:bg-slate-950`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <KeyboardShortcutsHelp />
          <main className="pt-20">{children}</main>
          <footer className="relative z-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-24 py-8">
            <div className="max-w-6xl mx-auto px-6 text-center text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Krishnatheja Vanka
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
