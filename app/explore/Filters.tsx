"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

// Tiny hash → color index for consistent chip colors per category/award
function hashToIndex(s: string, m: number) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % m;
}
const pastel = [
  "bg-sky-100 text-sky-800 ring-sky-200",
  "bg-violet-100 text-violet-800 ring-violet-200",
  "bg-emerald-100 text-emerald-800 ring-emerald-200",
  "bg-amber-100 text-amber-800 ring-amber-200",
  "bg-rose-100 text-rose-800 ring-rose-200",
  "bg-cyan-100 text-cyan-800 ring-cyan-200",
];

function Chip({
  label,
  active,
  onClick,
  paletteKey,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  paletteKey: string;
}) {
  const idx = hashToIndex(paletteKey || label, pastel.length);
  const palette = pastel[idx];
  return (
    <button
      onClick={onClick}
      title={label}
      className={[
        "rounded-full px-3 py-2 text-sm transition ring-1 ring-inset",
        active
          ? "bg-black text-white ring-black"
          : `${palette} hover:opacity-90` // <- soft pastel fill
      ].join(" ")}
      // Use pastel bg as a subtle dot before text when inactive
      style={!active ? { boxShadow: `inset 0 0 0 9999px rgba(0,0,0,0)` } : undefined}
    >
      <span className="inline-flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ring-1 ring-inset ${active ? "bg-white/40 ring-white/40" : pastel[idx]}`}
          aria-hidden
        />
        {label}
      </span>
    </button>
  );
}

export default function Filters({
  years,
  categories,
  awards,
}: {
  years: number[];
  categories: string[];
  awards: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const q = sp.get("q") || "";
  const category = sp.get("category") || "All";
  const year = sp.get("year") || "All";
  const award = sp.get("award") || "All";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(Array.from(sp.entries()));
    if (value === "All" || value === "") next.delete(key);
    else next.set(key, value);
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`);
  };

  const yearOptions = useMemo(() => years, [years]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {/* Search */}
      <div className="md:col-span-2">
        <div className="relative">
          <input
            defaultValue={q}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search titles, tags, descriptions…"
            className="w-full rounded-2xl border bg-white/90 px-4 py-3 pl-10 ring-1 ring-black/5 placeholder:text-gray-400 focus:outline-none"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
        </div>
      </div>

      {/* Category chips — wrap, no scrollbars */}
      <div className="md:col-span-2">
        <div className="flex flex-wrap gap-2">
          <Chip label="All" active={category === "All"} onClick={() => setParam("category", "All")} paletteKey="All" />
          {categories.map((c) => (
            <Chip key={c} label={c} active={category === c} onClick={() => setParam("category", c)} paletteKey={c} />
          ))}
        </div>
      </div>

      {/* Year + Award selects */}
      <div className="col-span-1 flex flex-col gap-2 md:col-span-2 md:flex-row">
        <select
          defaultValue={year}
          onChange={(e) => setParam("year", e.target.value)}
          className="w-full rounded-2xl border bg-white/90 px-3 py-2 ring-1 ring-black/5"
        >
          <option value="All">All years</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          defaultValue={award}
          onChange={(e) => setParam("award", e.target.value)}
          className="w-full rounded-2xl border bg-white/90 px-3 py-2 ring-1 ring-black/5"
        >
          <option value="All">All awards</option>
          {awards.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
