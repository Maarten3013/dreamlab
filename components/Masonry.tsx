import type { Project } from "@/lib/types";
import TileCard from "@/components/TileCard";

export default function Masonry({ projects }: { projects: Project[] }) {
  return (
    <div className="overflow-visible [&>*]:mb-3 columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
      {projects.map((p) => (
        <div key={p.id} style={{ breakInside: "avoid" }}>
          <TileCard p={p} />
        </div>
      ))}
    </div>
  );
}
