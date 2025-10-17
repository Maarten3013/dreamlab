"use client";
import { useEffect, useState } from "react";

export default function FilterSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Close on ESC + lock body scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.classList.toggle("overflow-hidden", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  return (
    <>
      {/* Tiny floating trigger */}
      <button
        aria-label="Open filters"
        onClick={() => setOpen(true)}
        className="fixed z-40 inline-flex h-12 w-12 items-center justify-center
                   rounded-full border border-white/20 bg-white/10 text-white shadow-lg
                   ring-1 ring-white/10 backdrop-blur hover:bg-white/20 transition
                   right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" className="text-white">
          <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" fill="currentColor" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Slide-over panel (ONLY visible when open) */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-neutral-950 p-5
                    shadow-2xl ring-1 ring-white/10 transition-transform duration-300 ease-out
                    ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Filters</h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full border border-white/20 px-3 py-1 text-sm text-white hover:bg-white/10"
          >
            Close
          </button>
        </div>

        {/* Your Filters UI */}
        <div className="space-y-4">{children}</div>
      </aside>
    </>
  );
}
