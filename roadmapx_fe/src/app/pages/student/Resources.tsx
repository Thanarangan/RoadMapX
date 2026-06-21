import { PageHeader, EmptyState } from "../../components/ui-bits";
import { BookOpen } from "lucide-react";

export default function StudentResources() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Library"
        title="Resources"
        description="All the resources from your active roadmaps in one place."
      />
      <EmptyState
        icon={BookOpen}
        title="Resources show up by topic"
        description="Open a roadmap and pick a topic to see its curated resources."
      />
    </div>
  );
}
