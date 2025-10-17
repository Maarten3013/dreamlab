import type { Project } from "@/lib/types";
import ProjectCard from "@/components/ProjectCard";

export default function Masonry({ projects }: { projects: Project[] }) {
  // CSS columns = simple, responsive masonry
  return (
    <div className="[&>*]:mb-4 columns-1 gap-4 sm:columns-2 lg:columns-3">
      {projects.map((p) => (
        // Ensure each item avoids breaking across columns
        <div key={p.id} style={{ breakInside: "avoid" }}>
          <ProjectCard p={p} />
        </div>
      ))}
    </div>
  );
}
