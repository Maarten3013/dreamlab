import data from "@/data/projects.json";
import type { Project } from "@/lib/types";
import { notFound } from "next/navigation";
import MosaicLightbox from "@/components/MosaicLightbox";

// Map award → overlay sticker (your real images in /public/awards/)
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
    <main className="mx-auto max-w-6xl animate-fade-in px-4 py-10">
      {/* Hero */}
      <section className="shine-sweep shine-run relative overflow-hidden rounded-3xl">
        {/* Award sticker */}
        {badge && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={badge.src} alt={badge.alt} className="pointer-events-none absolute right-5 top-5 z-20 h-16 w-auto select-none drop-shadow md:h-20 lg:h-24" />
        )}

        {/* Hero image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.cover} alt={p.title} className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          {/* Glass title bar on image */}
          <div className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl bg-white/25 p-4 backdrop-blur-md ring-1 ring-white/30">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-3xl font-extrabold leading-tight text-white drop-shadow">{p.title}</h1>
                {p.subtitle && <p className="mt-1 text-sm text-white/90">{p.subtitle}</p>}
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white ring-1 ring-white/30">{p.category}</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white ring-1 ring-white/30">{p.year}</span>
                {p.award && p.award !== "None" && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/30">
                    {p.award}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content + sticky sidebar */}
      <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Content */}
        <article className="prose max-w-none prose-p:leading-relaxed prose-headings:scroll-mt-24">
          <p className="whitespace-pre-line text-gray-800">{p.description}</p>

          {/* Mosaic gallery with lightbox */}
          <MosaicLightbox images={gallery} title={p.title} />
        </article>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Project</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Year</dt>
                <dd className="font-medium">{p.year}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Category</dt>
                <dd className="font-medium">{p.category}</dd>
              </div>
              {p.award && p.award !== "None" && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Award</dt>
                  <dd className="font-medium">{p.award}</dd>
                </div>
              )}
              {p.tags?.length > 0 && (
                <div>
                  <dt className="text-gray-500">Tags</dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">#{t}</span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            {(p.website || p.pdf) && <div className="my-4 h-px w-full bg-gray-200" />}

            <div className="flex flex-col gap-2">
              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
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
                  className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Download PDF
                </a>
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
