import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "../../lib/router-compat";
import { CheckCircle2, Circle, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { PageHeader, SkeletonGrid, EmptyState } from "../../components/ui-bits";
import {
  domainService,
  roadmapService,
  topicService,
  progressService,
  type Topic,
} from "../../lib/services";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";
import { toast } from "sonner";

export default function StudentRoadmapDetails() {
  const { roadmapId } = useParams();
  const id = Number(roadmapId);
  const qc = useQueryClient();

  const currentDomain = useQuery({ queryKey: ["current-domain"], queryFn: domainService.current });
  const roadmaps = useQuery({
    queryKey: ["roadmaps", currentDomain.data?.id],
    queryFn: () => roadmapService.byDomain(currentDomain.data!.id),
    enabled: !!currentDomain.data?.id,
  });
  const topics = useQuery({
    queryKey: ["topics", id],
    queryFn: () => topicService.byRoadmap(id),
    enabled: !!id,
  });
  const progress = useQuery({
    queryKey: ["progress", id],
    queryFn: () => progressService.byRoadmap(id),
    enabled: !!id,
  });

  const completedIds = useMemo(
    () => new Set((progress.data ?? []).filter((p) => p.completed !== false).map((p) => p.topicId)),
    [progress.data],
  );

  const completePct = useMemo(() => {
    const total = topics.data?.length ?? 0;
    if (!total) return 0;
    return Math.round((completedIds.size / total) * 100);
  }, [topics.data, completedIds]);
  const roadmap = roadmaps.data?.find((r) => r.id === id);

  const mark = useMutation({
    mutationFn: (topicId: number) =>
      progressService.save({ topicId, roadMapId: id, completed: true }),
    onSuccess: () => {
      toast.success("Topic marked complete");
      qc.invalidateQueries({ queryKey: ["progress", id] });
    },
  });

  const unmark = useMutation({
    mutationFn: (progressId: number) => progressService.remove(progressId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["progress", id] });
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow={currentDomain.data?.name ?? "Roadmap"}
        title={roadmap?.name ?? "Roadmap"}
        description={roadmap?.description ?? "Your structured path."}
      />

      <div className="mb-8 rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Overall progress</span>
          <span className="font-semibold">{completePct}%</span>
        </div>
        <Progress value={completePct} className="h-2" />
        <div className="mt-2 text-xs text-muted-foreground">
          {completedIds.size} of {topics.data?.length ?? 0} topics complete
        </div>
      </div>

      {topics.isLoading ? (
        <SkeletonGrid count={4} />
      ) : !topics.data || topics.data.length === 0 ? (
        <EmptyState icon={BookOpen} title="No topics in this roadmap yet" />
      ) : (
        <ol className="relative space-y-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {topics.data.map((t, i) => {
            const done = completedIds.has(t.id);
            const progressEntry = (progress.data ?? []).find((p) => p.topicId === t.id);
            return (
              <TopicItem
                key={t.id}
                topic={t}
                index={i + 1}
                roadmapId={id}
                done={done}
                onMark={() => mark.mutate(t.id)}
                onUnmark={() => progressEntry && unmark.mutate(progressEntry.id)}
                busy={
                  (mark.isPending && mark.variables === t.id) ||
                  (unmark.isPending && unmark.variables === progressEntry?.id)
                }
              />
            );
          })}
        </ol>
      )}
    </div>
  );
}

function TopicItem({
  topic,
  index,
  roadmapId,
  done,
  onMark,
  onUnmark,
  busy,
}: {
  topic: Topic;
  index: number;
  roadmapId: number;
  done: boolean;
  onMark: () => void;
  onUnmark: () => void;
  busy: boolean;
}) {
  return (
    <li className="relative pl-12">
      <div
        className={`absolute left-0 top-3 grid h-10 w-10 place-items-center rounded-full border-2 transition-all ${
          done
            ? "border-success bg-success text-success-foreground"
            : "border-border bg-card text-muted-foreground"
        }`}
      >
        {done ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <span className="text-sm font-semibold">{index}</span>
        )}
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-elegant">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold tracking-tight">{topic.name}</h3>
            {topic.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>
            )}
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {topic.resourceCount ?? "—"} resources
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              size="sm"
              variant={done ? "outline" : "default"}
              className={done ? "" : "bg-gradient-primary text-primary-foreground"}
              onClick={done ? onUnmark : onMark}
              disabled={busy}
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : done ? (
                <>
                  <Circle className="mr-1 h-3.5 w-3.5" /> Mark incomplete
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Mark complete
                </>
              )}
            </Button>
            <Link to={`/student/roadmaps/${roadmapId}/topic/${topic.id}`}>
              <Button size="sm" variant="ghost">
                Resources
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}
