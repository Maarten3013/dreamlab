// app/projects/[id]/page.tsx
import data from "@/data/projects.json";
import type { Project } from "@/lib/types";
import { notFound } from "next/navigation";
import MosaicLightbox from "@/components/MosaicLightbox";

// Map award → overlay sticker (your images in /public/awards/)
function awardImage(award?: string): { src: string; alt: string } | null {
  if (!award || award === "None") return null;
  const a = award.toLowerCase();
  if (a.includes("grand") && a.includes("prix")) return { src: "/awards/grand-prix.png", alt: "Grand Prix Award" };
  if (a.includes("coup") && a.includes("coeur")) return { src: "/awards/coup-de-coeur.png", alt: "Coup de Coeur Award" };
  if (a.includes("special")) return { src: "/awards/special-mention.png", alt: "Special Mention" };
  if (a.includes("focus")) return { src: "/awards/focus.png", alt: "Focus Award" };
  return { src: "/awards/default-award.png", alt: award };
}

export async function generateStaticParams() {
  return (data as Project[]).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = (data as Project[]).find((x) => x.id === id);
  if (!p) return {};
  return { title: `${p.title} – Project Explorer`, openGraph: { images: [{ url: p.cover }] } };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = (data as Project[]).find((x) => x.id === id);
  if (!p) notFound();

  const gallery = Array.isArray(p.images) ? p.images : [];
  const badge = awardImage(p.award);

  return (
    <main className="min-h-dvh bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back link */}
        <a href="/explore" className="text-sm text-white/60 hover:text-white/90">← Back to Explore</a>

        {/* HERO — matches Explore vibe */}
        <section className="relative mt-3 overflow-hidden rounded-3xl ring-1 ring-white/10">
          {badge && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={badge.src} alt={badge.alt} className="pointer-events-none absolute right-5 top-5 z-20 h-16 w-auto select-none drop-shadow md:h-20 lg:h-24" />
          )}

          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.cover} alt={p.title} className="h-full w-full object-cover" />
            {/* bottom gradient for legibility */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            {/* glossy title bar (white on black) */}
            <div className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl bg-black/60 p-4 backdrop-blur ring-1 ring-white/10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-extrabold leading-tight text-white">{p.title}</h1>
                  {p.subtitle && <p className="mt-1 text-sm text-white/80">{p.subtitle}</p>}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white ring-1 ring-white/15">
                    {p.category}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white ring-1 ring-white/15">
                    {p.year}
                  </span>
                  {p.award && p.award !== "None" && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ring-1 ring-white/15">
                      {p.award}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT + SIDEBAR — dark theme */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Description + Gallery */}
          <article className="text-white">
            <p className="whitespace-pre-line text-white/85">{p.description}</p>

            {/* Mosaic gallery with lightbox (already built) */}
            <MosaicLightbox images={gallery} title={p.title} />
          </article>

          {/* Sticky Sidebar (buttons & meta) */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 shadow-sm ring-1 ring-white/10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Project</h2>
              <dl className="mt-3 space-y-2 text-sm text-white/90">
                <div className="flex items-center justify-between">
                  <dt className="text-white/60">Year</dt>
                  <dd className="font-medium">{p.year}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-white/60">Category</dt>
                  <dd className="font-medium">{p.category}</dd>
                </div>
                {p.award && p.award !== "None" && (
                  <div className="flex items-center justify-between">
                    <dt className="text-white/60">Award</dt>
                    <dd className="font-medium">{p.award}</dd>
                  </div>
                )}
                {p.tags?.length > 0 && (
                  <div>
                    <dt className="text-white/60">Tags</dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white ring-1 ring-white/15">#{t}</span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              {(p.website || p.pdf) && <div className="my-4 h-px w-full bg-white/10" />}

              <div className="flex flex-col gap-2">
                {p.website && (
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                  >
                    Visit website ↗
                  </a>
                )}
                {p.pdf && (
                  <a
                    href={p.pdf}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
