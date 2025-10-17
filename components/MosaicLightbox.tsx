"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Img = { url: string; alt?: string } | string;

export default function MosaicLightbox({ images, title }: { images: Img[]; title: string }) {
  const items = useMemo(
    () =>
      (images ?? [])
        .map((img) => (typeof img === "string" ? { url: img, alt: title } : img))
        .filter((i) => !!i.url),
    [images, title]
  );

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [ui, setUi] = useState(true); // show/hide controls
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onOpen = (i: number) => {
    setIdx(i);
    setOpen(true);
    setUi(true);
  };
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  // close & arrows
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  // auto-hide UI after inactivity
  const pokeUI = () => {
    setUi(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setUi(false), 1800);
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Mosaic thumbnails */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {items.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => onOpen(i)}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl
                        bg-neutral-800 ring-1 ring-white/10 hover:ring-white/20 focus:outline-none"
              aria-label={`Open image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? title}
                className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:opacity-95"
                loading="lazy"
              />
            </button>
          ))}
        </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
          onMouseMove={pokeUI}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-black ring-1 ring-white/10">
              {/* image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={items[idx].url}
                alt={items[idx].alt ?? title}
                className="h-full w-full object-contain"
                onLoad={pokeUI}
              />

              {/* close (top-right) */}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full
                           bg-white/10 text-white ring-1 ring-white/20 backdrop-blur
                           hover:bg-white/20 transition ${ui ? "opacity-100" : "opacity-0"}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-95">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>

              {/* nav buttons */}
              {items.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous image"
                    className={`absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full
                                bg-white/10 text-white ring-1 ring-white/20 backdrop-blur
                                hover:bg-white/20 transition ${ui ? "opacity-100" : "opacity-0"}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-95">
                      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <button
                    onClick={next}
                    aria-label="Next image"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full
                                bg-white/10 text-white ring-1 ring-white/20 backdrop-blur
                                hover:bg-white/20 transition ${ui ? "opacity-100" : "opacity-0"}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-95">
                      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* progress pill */}
                  <div
                    className={`pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full
                                bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15
                                transition ${ui ? "opacity-100" : "opacity-0"}`}
                    aria-hidden
                  >
                    {idx + 1} / {items.length}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
