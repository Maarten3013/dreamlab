import { NextResponse } from "next/server";
import data from "@/data/projects.json";
import type { Project } from "@/lib/types";


const ALL = (v?: string | null) => (!v || v === "All");


export async function GET(req: Request) {
const { searchParams } = new URL(req.url);
const q = (searchParams.get("q") || "").toLowerCase();
const category = searchParams.get("category");
const award = searchParams.get("award");
const yearParam = searchParams.get("year");
const page = Number(searchParams.get("page") || 1);
const pageSize = Math.min(Number(searchParams.get("pageSize") || 18), 60);


let items = (data as Project[]).filter((p) => {
const matchesQ = q
.split(/\s+/)
.filter(Boolean)
.every((term) =>
[p.title, p.subtitle ?? "", p.description, p.tags.join(" "), p.category]
.join(" ")
.toLowerCase()
.includes(term)
);


const matchesCategory = ALL(category) || p.category === category;
const matchesAward = ALL(award) || p.award === award;
const matchesYear = ALL(yearParam) || p.year === Number(yearParam);


return matchesQ && matchesCategory && matchesAward && matchesYear;
});


items = items.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));


const total = items.length;
const start = (page - 1) * pageSize;
const end = start + pageSize;
const pageItems = items.slice(start, end);


return NextResponse.json({ projects: pageItems, total, page, pageSize });
}