import type { Project } from "@/lib/types";
import ProjectCard from "@/components/ProjectCard";

export default function Masonry({ projects }: { projects: Project[] }) {
  return (
    <div className="[&>*]:mb-3 columns-1 gap-3 sm:columns-2 lg:columns-3">
      {projects.map((p) => (
        <div key={p.id} style={{ breakInside: "avoid" }}>
          <ProjectCard p={p} />
        </div>
      ))}
    </div>
  );
}
