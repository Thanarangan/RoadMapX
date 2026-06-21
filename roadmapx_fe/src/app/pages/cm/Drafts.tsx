import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Eye, FileEdit, Pencil, Send } from "lucide-react";
import { PageHeader, SkeletonGrid, EmptyState, StatusBadge } from "../../components/ui-bits";
import {
  resourceService,
  roadmapService,
  topicService,
  type Roadmap,
  type Topic,
} from "../../lib/services";
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
import { Link } from "../../lib/router-compat";

export default function CmDrafts() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["cm-drafts"], queryFn: roadmapService.drafts });
  const [preview, setPreview] = useState<Roadmap | null>(null);

  const submit = useMutation({
    mutationFn: (r: Roadmap) => roadmapService.submitDraft(r.id),
    onSuccess: () => {
      toast.success("Submitted for approval");
      qc.invalidateQueries({ queryKey: ["cm-drafts"] });
    },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Workspace"
        title="Draft roadmaps"
        description="Continue editing, preview, or submit for admin approval."
        actions={
          <Link to="/cm/create">
            <Button className="bg-gradient-primary text-primary-foreground">New draft</Button>
          </Link>
        }
      />

      {isLoading ? (
        <SkeletonGrid />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={FileEdit}
          title="No drafts yet"
          description="Start a new roadmap to see drafts here."
          action={
            <Link to="/cm/create">
              <Button>Create roadmap</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-elegant"
            >
              <StatusBadge status={r.status || "draft"} />
              <h3 className="mt-3 text-base font-semibold tracking-tight line-clamp-1">{r.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {r.description ?? "No description"}
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setPreview(r)}>
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  Preview
                </Button>
                <Link to={`/cm/create?draftId=${r.id}`}>
                  <Button size="sm" variant="outline">
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                      <Send className="mr-1 h-3.5 w-3.5" />
                      Submit
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit "{r.name}" for review?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Admins will review and publish your roadmap. You won't be able to edit it
                        while it's under review.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => submit.mutate(r)}>
                        Submit for review
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <DraftPreview roadmap={preview} onOpenChange={(open) => !open && setPreview(null)} />
    </div>
  );
}

function DraftPreview({
  roadmap,
  onOpenChange,
}: {
  roadmap: Roadmap | null;
  onOpenChange: (open: boolean) => void;
}) {
  const topics = useQuery({
    queryKey: ["topics", roadmap?.id],
    queryFn: () => topicService.byRoadmap(roadmap!.id),
    enabled: !!roadmap?.id,
  });
  const resourceQueries = useQueries({
    queries: (topics.data ?? []).map((topic) => ({
      queryKey: ["resources", topic.id],
      queryFn: () => resourceService.byTopic(topic.id),
      enabled: !!topic.id,
    })),
  });

  return (
    <Dialog open={!!roadmap} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{roadmap?.name ?? "Draft preview"}</DialogTitle>
          <DialogDescription>
            {roadmap?.description ?? "Preview topics and resources before review."}
          </DialogDescription>
        </DialogHeader>

        {topics.isLoading ? (
          <SkeletonGrid count={3} />
        ) : !topics.data || topics.data.length === 0 ? (
          <EmptyState icon={FileEdit} title="No topics in this draft yet" />
        ) : (
          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            {topics.data.map((topic, index) => (
              <TopicPreview
                key={topic.id}
                topic={topic}
                index={index + 1}
                resources={resourceQueries[index]?.data ?? []}
                resourcesLoading={resourceQueries[index]?.isLoading ?? false}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TopicPreview({
  topic,
  index,
  resources,
  resourcesLoading,
}: {
  topic: Topic;
  index: number;
  resources: { id: number; title: string; type: string; url: string }[];
  resourcesLoading: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Topic {index}
      </div>
      <h3 className="mt-1 text-sm font-semibold">{topic.name}</h3>
      {topic.description && (
        <p className="mt-1 text-xs text-muted-foreground">{topic.description}</p>
      )}

      <div className="mt-3 space-y-2">
        {resourcesLoading ? (
          <div className="h-8 rounded shimmer" />
        ) : resources.length === 0 ? (
          <p className="text-xs text-muted-foreground">No resources added yet.</p>
        ) : (
          resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2 text-xs hover:bg-secondary/50"
            >
              <span className="min-w-0 truncate font-medium">{resource.title}</span>
              <span className="shrink-0 text-muted-foreground">{resource.type}</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
