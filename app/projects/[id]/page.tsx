import data from "@/data/projects.json";
import type { Project } from "@/lib/types";
import Badge from "@/components/Badge";
import Gallery from "@/components/Gallery"; // 👈 add this
import { notFound } from "next/navigation";
// …imports unchanged
import Link from "next/link";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = (data as Project[]).find((x) => x.id === id);
  if (!p) notFound();

  const gallery = Array.isArray(p.images) ? p.images : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <a href="/explore" className="text-sm text-gray-500">← Back to explore</a>

      <div className="mt-3 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.cover} alt={p.title} className="h-full w-full object-cover" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <h1 className="text-3xl font-bold leading-tight">{p.title}</h1>
        <span className="text-gray-400">•</span>
        <span className="text-sm text-gray-600">{p.year} · {p.category}</span>
        {p.award && p.award !== "None" && <Badge label={p.award} />}
      </div>

      {/* 👇 Action buttons */}
      {(p.website || p.pdf) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {p.website && (
            <a
              href={p.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Visit website ↗
            </a>
          )}
          {p.pdf && (
            <a
              href={p.pdf}           // e.g. "/docs/emergence_catalogue.pdf"
              download                // browser may ignore for cross-origin URLs
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Download PDF
            </a>
          )}
        </div>
      )}

      {p.subtitle && <p className="mt-4 text-gray-600">{p.subtitle}</p>}
      <p className="mt-4 whitespace-pre-line text-gray-700">{p.description}</p>

      {/* (Optional) gallery if you added it earlier */}
      {/* <Gallery images={gallery} title={p.title} /> */}

      <div className="mt-6 flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">#{t}</span>
        ))}
      </div>
    </main>
  );
}
