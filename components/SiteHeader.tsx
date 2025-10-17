import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-white">
          DreamLab
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/explore"
            className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
          >
            Explore
          </Link>
        </nav>
      </div>
    </header>
  );
}
