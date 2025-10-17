import type { Project } from "@/lib/types";
import TileCard from "@/components/TileCard";

export default function Masonry({ projects }: { projects: Project[] }) {
  // Columns masonry = perfect for Pinterest/eyecandy
  return (
    <div className="[&>*]:mb-4 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 overflow-visible">
      {projects.map((p) => (
        <div key={p.id} style={{ breakInside: "avoid" }}>
          <TileCard p={p} />
        </div>
      ))}
    </div>
  );
}
