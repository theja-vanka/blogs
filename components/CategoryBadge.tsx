import Link from "next/link";

const colors: Record<string, string> = {
  advanced:     "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  beginner:     "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300",
  code:         "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300",
  intermediate: "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-300",
  mlops:        "bg-rose-100   text-rose-700   dark:bg-rose-900/30   dark:text-rose-300",
  news:         "bg-teal-100   text-teal-700   dark:bg-teal-900/30   dark:text-teal-300",
  research:     "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  tutorial:     "bg-cyan-100   text-cyan-700   dark:bg-cyan-900/30   dark:text-cyan-300",
};

interface Props {
  category: string;
  small?: boolean;
  href?: string;
}

export default function CategoryBadge({ category, small, href }: Props) {
  const cls = colors[category] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  const base = `inline-block rounded-full font-medium ${small ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-0.5"} ${cls}`;

  if (href) {
    return (
      <Link href={href} className={`${base} hover:opacity-80 transition-opacity`}>
        {category}
      </Link>
    );
  }
  return <span className={base}>{category}</span>;
}
