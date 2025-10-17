import Link from "next/link";
import type { Project } from "@/lib/types";
import Badge from "./Badge";

function awardStyle(award?: string) {
  if (!award || award === "None") return { show: false, wrap: "", icon: "", text: "" };

  // You can tweak these per your labels:
  const base =
    "pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow ring-1 backdrop-blur";
  if (/grand\s*prix/i.test(award))
    return { show: true, wrap: `${base} bg-yellow-400/90 text-black ring-black/10`, icon: "🏆", text: award };
  if (/coup.?de.?coeur/i.test(award))
    return { show: true, wrap: `${base} bg-rose-500/90 text-white ring-black/10`, icon: "❤️", text: award };
  if (/special/i.test(award))
    return { show: true, wrap: `${base} bg-indigo-500/90 text-white ring-black/10`, icon: "⭐", text: award };
  if (/focus/i.test(award))
    return { show: true, wrap: `${base} bg-emerald-500/90 text-white ring-black/10`, icon: "🎯", text: award };

  // Fallback for any other non-empty award
  return { show: true, wrap: `${base} bg-black/70 text-white ring-white/10`, icon: "🏅", text: award };
}

export default function ProjectCard({ p }: { p: Project }) {
  const award = awardStyle(p.award);

  return (
    <Link
      href={`/projects/${p.id}`}
      className="group relative block overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-lg"
      aria-label={`${p.title}${p.award && p.award !== "None" ? ` — ${p.award}` : ""}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {/* Award overlay */}
        {award.show && (
          <span className={award.wrap} aria-hidden="true">
            <span>{award.icon}</span>
            <span>{award.text}</span>
          </span>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.cover}
          alt={p.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />

        {/* subtle top gradient to improve contrast for the ribbon on bright images */}
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
            {/* We no longer show award here since it's overlaid; keep the next line if you want both */}
            {/* {p.award && p.award !== "None" && <Badge label={p.award} />} */}
          </div>
        </div>
      </div>
    </Link>
  );
}
