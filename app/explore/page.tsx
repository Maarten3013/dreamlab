// app/explore/page.tsx
import ProjectCard from "@/components/ProjectCard";
import Filters from "./Filters";
import data from "@/data/projects.json";
import type { Project } from "@/lib/types";

type SP = Record<string, string | string[] | undefined>;

export default async function Explore({
  // Next 15+: searchParams is a Promise
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const spObj = await searchParams;

  // Read params
  const q = (typeof spObj.q === "string" ? spObj.q : "").toLowerCase().trim();
  const category = typeof spObj.category === "string" ? spObj.category : "All";
  const award = typeof spObj.award === "string" ? spObj.award : "All";
  const yearStr = typeof spObj.year === "string" ? spObj.year : "All";
  const page = Number(typeof spObj.page === "string" ? spObj.page : 1) || 1;
  const pageSize = 18;

  // Filter in-memory from local JSON
  let items = (data as Project[]).filter((p) => {
    const matchesQ =
      q === "" ||
      q
        .split(/\s+/)
        .filter(Boolean)
        .every((term) =>
          [p.title, p.subtitle ?? "", p.description, p.tags.join(" "), p.category]
            .join(" ")
            .toLowerCase()
            .includes(term)
        );

    const matchesCategory = category === "All" || p.category === category;
    const matchesAward = award === "All" || p.award === award;
    const matchesYear = yearStr === "All" || p.year === Number(yearStr);

    return matchesQ && matchesCategory && matchesAward && matchesYear;
  });

  // Sort newest first, then alpha
  items = items.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * pageSize;
  const projects = items.slice(start, start + pageSize);

  const years = Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2025 - i);
  const all = data as Project[];
  const categories = Array.from(new Set(all.map(p => p.category))).sort();
  const awards     = Array.from(new Set(all.map(p => p.award))).sort();
  
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Explore Projects</h1>
        <p className="text-gray-600">Search and filter a visual database of your work.</p>
      </header>

      <Filters years={years} categories={categories} awards={awards} />
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="mt-10 rounded-2xl border p-8 text-center text-gray-600">
          No results. Try clearing filters.
        </div>
      )}

      {total > pageSize && (
        <Pager total={total} page={safePage} pageSize={pageSize} />
      )}
    </main>
  );
}

function Pager({ total, page, pageSize }: { total: number; page: number; pageSize: number }) {
  const pages = Math.ceil(total / pageSize);
  const makeHref = (n: number) => {
    if (typeof window === "undefined") return `?page=${n}`;
    const sp = new URLSearchParams(window.location.search);
    sp.set("page", String(n));
    return `?${sp.toString()}`;
  };

  const prev = page > 1 ? page - 1 : null;
  const next = page < pages ? page + 1 : null;

  return (
    <div className="mx-auto mt-10 flex max-w-md items-center justify-between">
      <a className={`rounded-full border px-4 py-2 ${!prev && "pointer-events-none opacity-50"}`} href={prev ? makeHref(prev) : "#"}>
        ← Prev
      </a>
      <span className="text-sm text-gray-600">
        Page {page} of {pages} · {total} results
      </span>
      <a className={`rounded-full border px-4 py-2 ${!next && "pointer-events-none opacity-50"}`} href={next ? makeHref(next) : "#"}>
        Next →
      </a>
    </div>
  );
}
