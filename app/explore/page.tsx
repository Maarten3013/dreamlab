// app/explore/page.tsx
import Masonry from "@/components/Masonry";
import Filters from "./Filters";
import data from "@/data/projects.json";
import type { Project } from "@/lib/types";
import FilterSheet from "@/components/FilterSheet"; // 👈 add this
import Link from "next/link";
import ClearFilters from "@/components/ClearFilters"; // 👈 adjust import

type SP = Record<string, string | string[] | undefined>;

// --- add helpers ---
function cyrb53(str: string) { // string → 32-bit seed
  let h1 = 0xdeadbeef ^ str.length, h2 = 0x41c6ce57 ^ str.length;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = (h1 ^ (h1 >>> 16)) >>> 0;
  return h1;
}
function mulberry32(a: number) { // seeded PRNG
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shuffleInPlace<T>(arr: T[], seed: number) {
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default async function Explore({ searchParams }: { searchParams: Promise<SP> }) {
  const spObj = await searchParams;

  const q = (typeof spObj.q === "string" ? spObj.q : "").toLowerCase().trim();
  const category = typeof spObj.category === "string" ? spObj.category : "All";
  const award = typeof spObj.award === "string" ? spObj.award : "All";
  const yearStr = typeof spObj.year === "string" ? spObj.year : "All";
  const page = Number(typeof spObj.page === "string" ? spObj.page : 1) || 1;
  const pageSize = 48; // show more per page to fill the wall
  

    // Use ?seed=... or default to "YYYYMMDD" so it changes daily
  const seedStr =
    typeof spObj.seed === "string"
      ? spObj.seed
      : new Date().toISOString().slice(0, 10).replace(/-/g, ""); // e.g., 20251017
  const seed = cyrb53(seedStr);

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
    const matchesAward =
      award === "All" ||
      (award === "Winners"
        ? !!p.award && p.award !== "None"
        : p.award === award);
    const matchesYear = yearStr === "All" || p.year === Number(yearStr);
    return matchesQ && matchesCategory && matchesAward && matchesYear;
  });

  // Shuffle BEFORE pagination for a randomized wall
  shuffleInPlace(items, seed);

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
      <div className="mx-auto max-w-7xl px-4 py-3.5">
        <header className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl md:text-2xl tracking-tight text-white">
            <Link
              href="/"
              aria-label="Go to landing page"
              className="text-base md:text-lg font-extrabold tracking-tight text-white"
            >
              TU Delft | Dream Lab
            </Link>
          </h1>
          <ClearFilters /> {/* 👈 appears only when any filter is active */}
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
