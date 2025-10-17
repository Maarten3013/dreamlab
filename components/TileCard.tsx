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
                      sm:h-20 md:h-24 lg:h-28"
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
        <div className="
          pointer-events-none absolute inset-x-0 bottom-0 z-10
          mx-2 mb-2 rounded-2xl bg-black/70 px-3 py-2 backdrop-blur ring-1 ring-white/10
          md:translate-y-2 md:opacity-0 md:transition md:duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100
        ">
          <h3 className="line-clamp-1 text-sm md:text-base font-semibold text-white">{p.title}</h3>
        </div>

        {/* Subtle inner gradient for depth */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent via-transparent to-black/10" />
      </div>
    </Link>
  );
}
