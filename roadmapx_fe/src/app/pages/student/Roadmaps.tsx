import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "../../lib/router-compat";
import { ArrowRight, Compass, Map } from "lucide-react";
import { PageHeader, EmptyState, SkeletonGrid, StatusBadge } from "../../components/ui-bits";
import {
  domainService,
  progressService,
  roadmapService,
  topicService,
  type Roadmap,
} from "../../lib/services";
import { Button } from "@/components/ui/button";

export default function StudentRoadmaps() {
  const currentDomain = useQuery({ queryKey: ["current-domain"], queryFn: domainService.current });

  const roadmaps = useQuery({
    queryKey: ["roadmaps", currentDomain.data?.id],
    queryFn: () => roadmapService.byDomain(currentDomain.data!.id),
    enabled: !!currentDomain.data?.id,
  });

  const progressQueries = useQueries({
    queries: (roadmaps.data ?? []).map((roadmap) => ({
      queryKey: ["progress", roadmap.id],
      queryFn: () => progressService.byRoadmap(roadmap.id),
      enabled: !!roadmap.id,
    })),
  });
  const topicQueries = useQueries({
    queries: (roadmaps.data ?? []).map((roadmap) => ({
      queryKey: ["topics", roadmap.id],
      queryFn: () => topicService.byRoadmap(roadmap.id),
      enabled: !!roadmap.id,
    })),
  });

  const loading = currentDomain.isLoading || roadmaps.isLoading;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow={currentDomain.data?.name ?? "No domain selected"}
        title="Roadmaps"
        description="Structured learning paths for your current domain."
        actions={
          <Link to="/student/domains">
            <Button variant="outline">
              <Compass className="mr-1.5 h-4 w-4" />
              Change domain
            </Button>
          </Link>
        }
      />

      {loading ? (
        <SkeletonGrid />
      ) : !currentDomain.data ? (
        <EmptyState
          icon={Compass}
          title="Choose a domain first"
          description="Select a domain to load its roadmaps."
          action={
            <Link to="/student/domains">
              <Button>Browse domains</Button>
            </Link>
          }
        />
      ) : !roadmaps.data || roadmaps.data.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No roadmaps yet"
          description="This domain does not have approved roadmaps yet."
          action={
            <Link to="/student/domains">
              <Button variant="outline">Browse other domains</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.data.map((r, i) => {
            const completed =
              progressQueries[i]?.data?.filter((p) => p.completed !== false).length ?? 0;
            const total = topicQueries[i]?.data?.length ?? r.topicCount ?? 0;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <RoadmapCard
                key={r.id}
                roadmap={r}
                progress={progress}
                completed={completed}
                total={total}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function RoadmapCard({
  roadmap,
  progress,
  completed,
  total,
}: {
  roadmap: Roadmap;
  progress: number;
  completed: number;
  total: number;
}) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <StatusBadge status={roadmap.status || "active"} />
          <h3 className="mt-3 line-clamp-1 text-base font-semibold tracking-tight">
            {roadmap.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {roadmap.description ?? "A curated path to mastery."}
          </p>
        </div>
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="var(--color-border)"
              strokeWidth="5"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="url(#ringGradient)"
              strokeWidth="5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
            <defs>
              <linearGradient id="ringGradient" x1="0" y1="0" x2="64" y2="64">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-accent)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center text-xs font-semibold">
            {progress}%
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {completed} / {total} topics
        </span>
        <Link to={`/student/roadmaps/${roadmap.id}`}>
          <Button size="sm" variant="ghost" className="group/btn">
            Continue
            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
