export type Award = "Grand Prix" | "Focus" | "Special Mention" | "Coup de Coeur" | "None";
export type Category = "Sea" | "Space" | "Climate" | "Other";

export type Project = {
  id: string;
  title: string;
  subtitle?: string;
  year: number;
  category: string; // allow any string
  award: string;    // allow any string
  tags: string[];
  cover: string;    // e.g. "/data/images/emergence_4.avif"
  description: string;
  images?: string[] | { url: string; alt?: string }[]; // support simple arrays
};