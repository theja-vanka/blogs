"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  prevSlug?: string;
  nextSlug?: string;
}

export default function PostKeyboardNav({ prevSlug, nextSlug }: Props) {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const editable =
        tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable;
      if (editable || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "j" && nextSlug) router.push(`/posts/${nextSlug}/`);
      if (e.key === "k" && prevSlug) router.push(`/posts/${prevSlug}/`);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prevSlug, nextSlug, router]);

  return null;
}
