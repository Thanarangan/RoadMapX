import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Eye, Inbox } from "lucide-react";
import { PageHeader, SkeletonGrid, EmptyState, StatusBadge } from "../../components/ui-bits";
import { resourceService, roadmapService, topicService, type Resource, type Roadmap } from "../../lib/services";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function AdminPendingRoadmaps() {
  const qc = useQueryClient();
  const [preview, setPreview] = useState<Roadmap | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["pending-roadmaps"],
    queryFn: roadmapService.pendingAdmin,
  });

  const approve = useMutation({
    mutationFn: (id: number) => roadmapService.approve(id),
    onSuccess: () => {
      toast.success("Roadmap approved");
      qc.invalidateQueries({ queryKey: ["pending-roadmaps"] });
    },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Approval queue"
        title="Pending roadmaps"
        description="Preview and approve roadmaps before they're published."
      />

      {isLoading ? (
        <SkeletonGrid />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Inbox} title="All caught up" description="No roadmaps awaiting review." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-elegant"
            >
              <StatusBadge status={r.status || "pending"} />
              <h3 className="mt-3 text-base font-semibold tracking-tight line-clamp-1">{r.name}</h3>
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                {r.description ?? "No description"}
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setPreview(r)}>
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  Preview
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                      <Check className="mr-1 h-3.5 w-3.5" />
                      Approve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve "{r.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This roadmap will be published and visible to students.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => approve.mutate(r.id)}>
                        Approve
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{preview?.name}</DialogTitle>
            <DialogDescription>{preview?.description}</DialogDescription>
          </DialogHeader>
          {preview && <RoadmapReviewDetails roadmapId={preview.id} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RoadmapReviewDetails({ roadmapId }: { roadmapId: number }) {
  const topics = useQuery({
    queryKey: ["topics", roadmapId],
    queryFn: () => topicService.byRoadmap(roadmapId),
  });
  const resourceQueries = useQueries({
    queries: (topics.data ?? []).map((topic) => ({
      queryKey: ["resources", topic.id],
      queryFn: () => resourceService.byTopic(topic.id),
      enabled: !!topic.id,
    })),
  });

  if (topics.isLoading) {
    return <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">Loading roadmap content...</div>;
  }

  if (!topics.data?.length) {
    return <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">No topics were added to this roadmap.</div>;
  }

  return (
    <div className="max-h-[60vh] space-y-3 overflow-auto pr-1">
      {topics.data.map((topic, index) => {
        const resources = (resourceQueries[index]?.data ?? []) as Resource[];
        return (
          <section key={topic.id} className="rounded-lg border border-border bg-secondary/30 p-3">
            <h3 className="text-sm font-semibold">{topic.name}</h3>
            {topic.description && (
              <p className="mt-1 text-xs text-muted-foreground">{topic.description}</p>
            )}
            <div className="mt-3 space-y-2">
              {resources.length === 0 ? (
                <p className="text-xs text-muted-foreground">No resources for this topic.</p>
              ) : (
                resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-md border border-border bg-background/70 p-2 text-xs hover:bg-background"
                  >
                    <span className="font-medium">{resource.title}</span>
                    <span className="ml-2 text-muted-foreground">{resource.type}</span>
                  </a>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
