// app/explore/page.tsx
import Masonry from "@/components/Masonry";
import Filters from "./Filters";
import data from "@/data/projects.json";
import type { Project } from "@/lib/types";
import FilterSheet from "@/components/FilterSheet"; // 👈 add this

type SP = Record<string, string | string[] | undefined>;

export default async function Explore({ searchParams }: { searchParams: Promise<SP> }) {
  const spObj = await searchParams;

  const q = (typeof spObj.q === "string" ? spObj.q : "").toLowerCase().trim();
  const category = typeof spObj.category === "string" ? spObj.category : "All";
  const award = typeof spObj.award === "string" ? spObj.award : "All";
  const yearStr = typeof spObj.year === "string" ? spObj.year : "All";
  const page = Number(typeof spObj.page === "string" ? spObj.page : 1) || 1;
  const pageSize = 48; // show more per page to fill the wall

  let items = (data as Project[]).filter((p) => {
    const matchesQ =
      q === "" ||
      q.split(/\s+/).filter(Boolean).every((term) =>
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

  items = items.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * pageSize;
  const projects = items.slice(start, start + pageSize);

  const years = Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2025 - i);
  const categories = Array.from(new Set((data as Project[]).map((p) => p.category))).sort();
  const awards = Array.from(new Set((data as Project[]).map((p) => p.award))).sort();

  return (
    <main className="min-h-dvh bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-4">
          <h1 className="text-2xl tracking-tight text-right text-white">TU Delft | Dream Lab</h1>
          <p className="mt-10 text-gray-400"></p>
        </header>

        {/* remove the old visible tray:
        <div className="mb-6 rounded-3xl border bg-white/80 p-4 backdrop-blur ring-1 ring-black/5">
          <Filters ... />
        </div>
        */}

        {/* tiny floating trigger + hidden panel */}
        <FilterSheet>
          <Filters years={years} categories={categories} awards={awards} />
        </FilterSheet>

        <Masonry projects={projects as Project[]} />

        {projects.length === 0 && (
          <div className="mt-10 rounded-3xl border bg-white/80 p-10 text-center text-gray-600">
            No results. Try clearing filters.
          </div>
        )}

        {total > pageSize && <Pager total={total} page={safePage} pageSize={pageSize} />}
      </div>
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
      <a className={`rounded-full border px-4 py-2 transition ${!prev ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`} href={prev ? makeHref(prev) : "#"}>
        ← Prev
      </a>
      <span className="text-sm text-gray-600">Page {page} of {pages} · {total} results</span>
      <a className={`rounded-full border px-4 py-2 transition ${!next ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`} href={next ? makeHref(next) : "#"}>
        Next →
      </a>
    </div>
  );
}
