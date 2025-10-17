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
      className="group relative block w-full overflow-hidden rounded-3xl"
      style={{ breakInside: "avoid" }}
      aria-label={p.title}
    >
      {/* Award sticker (top-right) */}
      {badge && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={badge.src}
          alt={badge.alt}
          className="pointer-events-none absolute right-3 top-3 z-20 h-12 w-auto select-none drop-shadow md:h-14 lg:h-16"
          loading="eager"
        />
      )}

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.cover}
        alt={p.title}
        className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        loading="lazy"
      />

      {/* Hover overlay (title only) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="mx-2 mb-2 rounded-2xl bg-black/55 px-3 py-2 backdrop-blur">
          <h3 className="line-clamp-1 text-base font-semibold text-white">{p.title}</h3>
        </div>
      </div>
    </Link>
  );
}
