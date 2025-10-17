import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import data from "@/data/projects.json";
import type { Project } from "@/lib/types";
import Masonry from "@/components/Masonry";

export default function Home() {
  // Pick featured: newest first, prefer awarded
  const all = data as Project[];
  const featured = [...all]
    .sort((a, b) => {
      const awardScore = (p: Project) =>
        p.award && p.award !== "None" ? 1 : 0;
      // sort by: award desc, year desc, title asc
      return (
        awardScore(b) - awardScore(a) ||
        b.year - a.year ||
        a.title.localeCompare(b.title)
      );
    })
    .slice(0, 12);

  return (
    <main className="min-h-dvh bg-black text-white">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* soft corner glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-[-10%] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute right-[-10%] top-[-20%] h-[30rem] w-[30rem] rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 md:pt-16">
          <h1 className="text-balance text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            A cinematic archive of <span className="text-cyan-300">projects</span> &{" "}
            <span className="text-violet-300">ideas</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Browse prototypes, installations, space habitats and more — filtered,
            fast, and beautiful.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/explore"
              className="rounded-2xl border border-cyan-400/50 bg-cyan-400/20 px-5 py-3 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-300/30 transition hover:bg-cyan-400/30 hover:ring-cyan-300/50"
            >
              Explore projects →
            </Link>
            <a
              href="mailto:hello@example.com"
              className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED WALL */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured</h2>
          <Link
            href="/explore"
            className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline"
          >
            View all
          </Link>
        </div>

        {/* Reuse your Pinterest-style masonry + Tile cards */}
        <Masonry projects={featured} />
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/50">
        © {new Date().getFullYear()} DreamLab — Built with Next.js + Tailwind
      </footer>
    </main>
  );
}
