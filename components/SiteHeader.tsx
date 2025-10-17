import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
      <div
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3
                   [padding-left:calc(1rem+env(safe-area-inset-left))]
                   [padding-right:calc(1rem+env(safe-area-inset-right))]"
      >
        <Link href="/" className="text-base md:text-lg font-extrabold tracking-tight text-white">
          TU Delft&nbsp;|&nbsp;Dream Lab
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/explore"
            className="rounded-full border border-white/20 px-3 py-2 text-xs md:text-sm text-white hover:bg-white/10"
          >
            Explore
          </Link>
        </nav>
      </div>
    </header>
  );
}