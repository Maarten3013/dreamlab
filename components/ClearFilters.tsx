"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const FILTER_KEYS = ["q", "category", "year", "award", "page"];

export default function ClearFilters() {               // 👈 default export
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const hasActive = useMemo(() => {
    const q = sp.get("q")?.trim();
    const category = sp.get("category");
    const year = sp.get("year");
    const award = sp.get("award");
    const page = sp.get("page");
    return Boolean(
      (q && q.length > 0) ||
      (category && category !== "All") ||
      (year && year !== "All") ||
      (award && award !== "All") ||
      (page && page !== "1")
    );
  }, [sp]);

  if (!hasActive) return null;

  const onClear = () => {
    const next = new URLSearchParams(Array.from(sp.entries()));
    FILTER_KEYS.forEach((k) => next.delete(k)); // keep other params like ?seed
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <button
      onClick={onClear}
      className="text-xs md:text-sm text-white/70 hover:text-white/95 hover:cursor-pointer
                 rounded px-1 focus:outline-none "
    >
      Remove filters
    </button>
  );
}
