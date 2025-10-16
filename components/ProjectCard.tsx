import Badge from "./Badge";
import type { Project } from "@/lib/types";
import Link from "next/link";


export default function ProjectCard({ p }: { p: Project }) {
return (
<Link
href={`/projects/${p.id}`}
className="group relative block overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-lg"
>
<div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={p.cover} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
</div>
<div className="flex items-start justify-between gap-3 p-4">
<div>
<h3 className="text-base font-semibold leading-tight">{p.title}</h3>
{p.subtitle && <p className="text-sm text-gray-500">{p.subtitle}</p>}
<div className="mt-2 flex flex-wrap gap-2">
<Badge label={p.category} />
<Badge label={String(p.year)} />
{p.award !== "None" && <Badge label={p.award} />}
</div>
</div>
</div>
</Link>
);
}