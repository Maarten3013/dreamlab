export type Award = "Grand Prix" | "Focus" | "Special Mention" | "Coup de Coeur" | "None";
export type Category = "Sea" | "Space" | "Climate" | "Other";


export type Project = {
id: string;
title: string;
subtitle?: string;
year: number;
category: Category;
award: Award;
tags: string[];
cover: string;
description: string;
images?: { url: string; alt?: string }[];
};