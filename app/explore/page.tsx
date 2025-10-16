import ProjectCard from "@/components/ProjectCard";
import Filters from "./Filters";


async function getData(search: string) {
const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/projects${search ? `?${search}` : ""}`;
const res = await fetch(url, { next: { revalidate: 0 } }); // no cache in dev
if (!res.ok) throw new Error("Failed to load projects");
return res.json();
}


export default async function Explore({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
const sp = new URLSearchParams();
for (const [k, v] of Object.entries(searchParams)) if (typeof v === "string") sp.set(k, v);
const { projects, total, page = 1, pageSize = 18 } = await getData(sp.toString());


const years = Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2025 - i);


return (
<main className="mx-auto max-w-7xl px-4 py-10">
<header className="mb-8 space-y-2">
<h1 className="text-3xl font-bold tracking-tight">Explore Projects</h1>
<p className="text-gray-600">Search and filter a visual database of your work.</p>
</header>


<Filters years={years} />


<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
{projects.map((p: any) => (
<ProjectCard key={p.id} p={p} />
))}
</div>


{projects.length === 0 && (
<div className="mt-10 rounded-2xl border p-8 text-center text-gray-600">No results. Try clearing filters.</div>
)}


{/* Simple pager (prev/next) */}
{total > pageSize && (
<Pager total={total} page={Number(page)} pageSize={Number(pageSize)} />
)}
</main>
);
}


function Pager({ total, page, pageSize }: { total: number; page: number; pageSize: number }) {
const pages = Math.ceil(total / pageSize);
const prev = page > 1 ? page - 1 : null;
const next = page < pages ? page + 1 : null;


const makeHref = (n: number) => {
if (typeof window === "undefined") return `?page=${n}`;
const sp = new URLSearchParams(window.location.search);
sp.set("page", String(n));
return `?${sp.toString()}`;
};


return (
<div className="mx-auto mt-10 flex max-w-md items-center justify-between">
<a className={`rounded-full border px-4 py-2 ${!prev && "pointer-events-none opacity-50"}`} href={prev ? makeHref(prev) : "#"}>
← Prev
</a>
<span className="text-sm text-gray-600">
Page {page} of {pages} · {total} results
</span>
<a className={`rounded-full border px-4 py-2 ${!next && "pointer-events-none opacity-50"}`} href={next ? makeHref(next) : "#"}>
Next →
</a>
</div>
);
}