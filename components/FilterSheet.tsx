"use client";
import { useEffect, useState } from "react";

export default function FilterSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Tiny floating trigger (bottom-right) */}
      <button
        aria-label="Open filters"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center
        rounded-full border border-white/10 bg-white/5 shadow-lg ring-1 ring-white/10
        backdrop-blur hover:bg-white/10 hover:ring-white/30 transition">
            
        {/* funnel icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="opacity-80">
          <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Slide-over panel */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-neutral-950 p-5
        shadow-2xl ring-1 ring-white/10 transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full border border-white/10 px-3 py-1 text-sm text-white hover:bg-white/10"
            aria-label="Close filters"
          >
            Close
          </button>
        </div>

        <div className="space-y-4">{children}</div>
      </aside>
    </>
  );
}
