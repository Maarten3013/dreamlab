import Link from "next/link";
import type { Project } from "@/lib/types";

function awardImage(award?: string): { src: string; alt: string } | null {
  if (!award || award === "None") return null;
  const a = award.toLowerCase();
  if (a.includes("grand") && a.includes("prix")) return { src: "/awards/grand-prix.png", alt: "Grand Prix" };
  if (a.includes("coup") && a.includes("coeur")) return { src: "/awards/coup-de-coeur.png", alt: "Coup de Coeur" };
  if (a.includes("special")) return { src: "/awards/special-mention.png", alt: "Special Mention" };
  if (a.includes("focus")) return { src: "/awards/focus.png", alt: "Focus" };
  return { src: "/awards/default-award.png", alt: award };
}

export default function TileCard({ p }: { p: Project }) {
  const badge = awardImage(p.award);

  return (
    <Link
      href={`/projects/${p.id}`}
      className="group relative block w-full overflow-visible"
      style={{ breakInside: "avoid" }}
      aria-label={p.title}
    >
      <div
        className="relative rounded-3xl ring-1 ring-white/10 transition
                   duration-300 will-change-transform
                   hover:ring-2 hover:ring-cyan-400/60 hover:shadow-[0_0_0_1px_rgba(34,211,238,.3)]
                   hover:drop-shadow-[0_10px_30px_rgba(34,211,238,.15)]
                   group-hover:translate-y-[-2px]">
        {/* Award sticker */}
        {badge && (
          <img
            src={badge.src}
            alt={badge.alt}
            className="pointer-events-none absolute right-3 top-3 z-20
                      h-16 w-auto select-none drop-shadow
                      sm:h-20 md:h-24 lg:h-20"
            loading="eager"
          />
        )}
        
        {/* Image */}
        <img
          src={p.cover}
          alt={p.title}
          className="h-auto w-full rounded-3xl object-cover
                     transition-transform duration-500
                     group-hover:scale-[1.06]"
          loading="lazy"
        />

        {/* Hover title pill */}
        <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10">
          <div
            className="
              translate-y-0 opacity-100
              md:translate-y-2 md:opacity-0
              md:group-hover:translate-y-0 md:group-hover:opacity-100
              transition-all duration-300
              rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 shadow-sm
            "
          >
            <div className="flex items-center justify-between px-3 py-1.5">
              <h3 className="truncate text-sm font-medium text-white/95">{p.title}</h3>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-white/70 transition-transform duration-300 md:group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Subtle inner gradient for depth */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent via-transparent to-black/10" />
      </div>
    </Link>
  );
}
