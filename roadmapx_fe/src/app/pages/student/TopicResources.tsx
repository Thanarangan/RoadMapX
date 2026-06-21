import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "../../lib/router-compat";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  FileText,
  Globe,
  PlayCircle,
  Newspaper,
  BookMarked,
} from "lucide-react";
import { PageHeader, SkeletonGrid, EmptyState } from "../../components/ui-bits";
import {
  resourceService,
  topicService,
  type Resource,
  type ResourceType,
} from "../../lib/services";
import { Button } from "@/components/ui/button";

const ICON: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
  PDF: FileText,
  VIDEO: PlayCircle,
  ARTICLE: Newspaper,
  WEBSITE: Globe,
  BOOK: BookMarked,
};

const TONE: Record<ResourceType, string> = {
  PDF: "bg-destructive/10 text-destructive",
  VIDEO: "bg-primary/10 text-primary",
  ARTICLE: "bg-accent/10 text-accent",
  WEBSITE: "bg-success/10 text-success",
  BOOK: "bg-warning/20 text-warning-foreground",
};

export default function StudentTopicResources() {
  const { topicId, roadmapId } = useParams();
  const id = Number(topicId);
  const roadMapId = Number(roadmapId);
  const topics = useQuery({
    queryKey: ["topics", roadMapId],
    queryFn: () => topicService.byRoadmap(roadMapId),
    enabled: !!roadMapId,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["resources", id],
    queryFn: () => resourceService.byTopic(id),
    enabled: !!id,
  });
  const topic = topics.data?.find((t) => t.id === id);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to={`/student/roadmaps/${roadmapId}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to roadmap
      </Link>
      <PageHeader
        eyebrow="Topic resources"
        title={topic?.name ?? "Topic resources"}
        description={topic?.description ?? "Hand-picked learning material."}
      />

      {isLoading ? (
        <SkeletonGrid count={4} />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={BookOpen} title="No resources for this topic yet" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = ICON[resource.type] ?? BookOpen;
  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-elegant hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${TONE[resource.type]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {resource.type}
          </div>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold tracking-tight">
            {resource.title}
          </h3>
        </div>
      </div>
      {resource.description && (
        <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{resource.description}</p>
      )}
      <a href={resource.url} target="_blank" rel="noreferrer" className="mt-auto pt-4">
        <Button size="sm" variant="outline" className="w-full">
          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
          Open resource
        </Button>
      </a>
    </div>
  );
}
