export type Award = "Grand Prix" | "Focus" | "Special Mention" | "Coup de Coeur" | "None";
export type Category = "Sea" | "Space" | "Climate" | "Other";

export type Project = {
  id: string;
  title: string;
  subtitle?: string;
  year: number;
  category: string;
  award: string;
  tags: string[];
  cover: string;
  description: string;
  images?: string[] | { url: string; alt?: string }[];
  website?: string; // 👈 NEW (external URL)
  pdf?: string;     // 👈 NEW (public file path, e.g. "/docs/emergence.pdf")
};
