import Link from "next/link";
import type { Project } from "@/lib/types";

// Map award label → your sticker image in /public/awards
function awardImage(award?: string): { src: string; alt: string } | null {
  if (!award || award === "None") return null;
  const a = award.toLowerCase();

  if (a.includes("grand") && a.includes("prix"))
    return { src: "/awards/grand-prix.png", alt: "Grand Prix Award" };
  if (a.includes("coup") && a.includes("coeur"))
    return { src: "/awards/coup-de-coeur.png", alt: "Coup de Coeur Award" };
  if (a.includes("special"))
    return { src: "/awards/special-mention.png", alt: "Special Mention" };
  if (a.includes("focus"))
    return { src: "/awards/focus.png", alt: "Focus Award" };

  return { src: "/awards/default-award.png", alt: award }; // optional fallback
}

export default function ProjectCard({ p }: { p: Project }) {
  const badge = awardImage(p.award);

  return (
    <Link
      href={`/projects/${p.id}`}
      className="group relative block overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-lg"
      aria-label={`${p.title}${p.award && p.award !== "None" ? ` — ${p.award}` : ""}`}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {/* Award sticker overlay (actual image you provided) */}
        {badge && (
          <img
            src={badge.src}
            alt={badge.alt}
            className="pointer-events-none absolute right-3 top-3 z-10 h-8 w-auto select-none drop-shadow md:h-10 lg:h-12"
            loading="eager"
          />
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.cover}
          alt={p.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />

        {/* slight gradient helps badge readability on bright photos */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/10 to-transparent" />
      </div>

      {/* Meta */}
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold leading-tight">{p.title}</h3>
          {p.subtitle && <p className="text-sm text-gray-500">{p.subtitle}</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
              {p.category}
            </span>
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
              {String(p.year)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
