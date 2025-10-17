"use client";
import { useEffect, useMemo, useState } from "react";

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

  const onOpen = (i: number) => { setIdx(i); setOpen(true); };
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

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

  if (items.length === 0) return null;

  return (
    <>
      {/* Pinterest-like mosaic via CSS columns */}
      <div className="mt-8 animate-fade-in columns-2 gap-3 md:columns-3">
        {items.map((img, i) => (
          <button
            key={img.url + i}
            onClick={() => onOpen(i)}
            className="mb-3 w-full overflow-hidden rounded-2xl bg-gray-100 transition hover:opacity-90 focus:outline-none"
            style={{ breakInside: "avoid" }}
            aria-label={`Open image ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt ?? title} className="h-auto w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={items[idx].url} alt={items[idx].alt ?? title} className="h-full w-full object-contain" />
            </div>
            <button onClick={() => setOpen(false)} className="absolute right-2 top-2 rounded-full bg-white/90 px-3 py-1 text-sm font-medium shadow">
              Close
            </button>
            {items.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-xl bg-white/90 px-3 py-2 text-sm font-medium shadow">‹</button>
                <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 rounded-l-xl bg-white/90 px-3 py-2 text-sm font-medium shadow">›</button>
                <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow">
                  {idx + 1} / {items.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
