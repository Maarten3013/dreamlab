"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
      <div className="md:col-span-2">
        <input
          defaultValue={q}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder="Search titles, tags, descriptions…"
          className="w-full rounded-xl border px-4 py-3 focus:outline-none"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => setParam("category", "All")}
          className={`rounded-full border px-3 py-2 text-sm ${category === "All" ? "bg-black text-white" : ""}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setParam("category", c)}
            className={`whitespace-nowrap rounded-full border px-3 py-2 text-sm ${category === c ? "bg-black text-white" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <select
          defaultValue={year}
          onChange={(e) => setParam("year", e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
        >
          <option value="All">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          defaultValue={award}
          onChange={(e) => setParam("award", e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
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
