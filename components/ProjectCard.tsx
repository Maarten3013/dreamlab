import Link from "next/link";
import type { Project } from "@/lib/types";
import Badge from "./Badge";

function awardClasses(award?: string) {
  if (!award || award === "None") return null;

  // Map labels → colors (tweak as you like)
  if (/grand\s*prix/i.test(award))
    return "bg-yellow-400 text-black";
  if (/coup.?de.?coeur/i.test(award))
    return "bg-rose-500 text-white";
  if (/special/i.test(award))
    return "bg-indigo-600 text-white";
  if (/focus/i.test(award))
    return "bg-emerald-600 text-white";
  return "bg-black/80 text-white";
}

export default function ProjectCard({ p }: { p: Project }) {
  const ribbon = awardClasses(p.award);

  return (
    <Link
      href={`/projects/${p.id}`}
      className="group relative block overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-lg"
      aria-label={`${p.title}${p.award && p.award !== "None" ? ` — ${p.award}` : ""}`}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {/* Diagonal corner ribbon (no emojis) */}
        {ribbon && (
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-0 w-0">
            {/* The strip: rotate and place across the corner */}
            <div
              className={`absolute -right-12 top-4 rotate-45 ${ribbon} 
                          px-8 py-1 text-[11px] font-semibold uppercase tracking-wide
                          shadow ring-1 ring-black/10`}
              style={{ transformOrigin: "center" }}
            >
              {p.award}
            </div>
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.cover}
          alt={p.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle top gradient to ensure ribbon readability on bright photos */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* Meta */}
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold leading-tight">{p.title}</h3>
          {p.subtitle && <p className="text-sm text-gray-500">{p.subtitle}</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge label={p.category} />
            <Badge label={String(p.year)} />
            {/* Award chip removed here since it's on the image now. Re-add if you want both. */}
          </div>
        </div>
      </div>
    </Link>
  );
}
