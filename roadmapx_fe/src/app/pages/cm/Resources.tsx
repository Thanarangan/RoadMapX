import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Library, Pencil, Plus, Search, Trash2, ExternalLink } from "lucide-react";
import { PageHeader, EmptyState, SkeletonGrid } from "../../components/ui-bits";
import {
  domainService,
  resourceService,
  roadmapService,
  topicService,
  type Resource,
  type ResourceType,
} from "../../lib/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";

const TYPES: ResourceType[] = ["PDF", "VIDEO", "ARTICLE", "WEBSITE", "BOOK"];

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  url: z.string().trim().url("Invalid URL").max(1000),
  type: z.enum(["PDF", "VIDEO", "ARTICLE", "WEBSITE", "BOOK"]),
  topicId: z.string().min(1, "Pick a topic"),
  description: z.string().trim().max(1000).optional(),
});
type FormValues = z.infer<typeof schema>;

export default function CmResources() {
  const qc = useQueryClient();
  const domains = useQuery({ queryKey: ["domains"], queryFn: domainService.list });
  const drafts = useQuery({ queryKey: ["cm-drafts"], queryFn: roadmapService.drafts });
  const [domainId, setDomainId] = useState("");
  const [roadmapId, setRoadmapId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);

  const topics = useQuery({
    queryKey: ["topics", Number(roadmapId)],
    queryFn: () => topicService.byRoadmap(Number(roadmapId)),
    enabled: !!roadmapId,
  });
  const activeRoadmaps = useQuery({
    queryKey: ["roadmaps", Number(domainId)],
    queryFn: () => roadmapService.byDomain(Number(domainId)),
    enabled: !!domainId,
  });

  const resources = useQuery({
    queryKey: ["resources", Number(topicId)],
    queryFn: () => resourceService.byTopic(Number(topicId)),
    enabled: !!topicId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", url: "", type: "ARTICLE", topicId: "", description: "" },
  });

  function openCreate() {
    setEditing(null);
    form.reset({ title: "", url: "", type: "ARTICLE", topicId, description: "" });
    setOpen(true);
  }

  function openEdit(r: Resource) {
    setEditing(r);
    form.reset({
      title: r.title,
      url: r.url,
      type: r.type,
      topicId: String(r.topicId ?? topicId),
      description: r.description ?? "",
    });
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: (v: FormValues) => {
      const payload = { ...v, topicId: Number(v.topicId) };
      return editing ? resourceService.update(editing.id, payload) : resourceService.add(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Resource updated" : "Resource added");
      qc.invalidateQueries({ queryKey: ["resources"] });
      setOpen(false);
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => resourceService.remove(id),
    onSuccess: () => {
      toast.success("Resource removed");
      qc.invalidateQueries({ queryKey: ["resources"] });
    },
  });

  const filtered = (resources.data ?? [])
    .filter((r) => (typeFilter === "all" ? true : r.type === typeFilter))
    .filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
  const roadmaps = [
    ...(activeRoadmaps.data ?? []),
    ...(drafts.data ?? []).filter((r) => !domainId || String(r.domainId) === domainId),
  ].filter((roadmap, index, all) => all.findIndex((item) => item.id === roadmap.id) === index);

  const TYPE_TONE: Record<ResourceType, string> = {
    PDF: "bg-destructive/10 text-destructive",
    VIDEO: "bg-primary/10 text-primary",
    ARTICLE: "bg-accent/10 text-accent",
    WEBSITE: "bg-success/10 text-success",
    BOOK: "bg-warning/20 text-warning-foreground",
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Library"
        title="Resources"
        description="Curate the best learning material per topic."
        actions={
          <Button
            onClick={openCreate}
            disabled={!topicId}
            className="bg-gradient-primary text-primary-foreground"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add resource
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-5">
        <Select
          value={domainId}
          onValueChange={(v) => {
            setDomainId(v);
            setRoadmapId("");
            setTopicId("");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent>
            {(domains.data ?? []).map((d) => (
              <SelectItem key={d.id} value={String(d.id)}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roadmapId} onValueChange={(v) => { setRoadmapId(v); setTopicId(""); }} disabled={!domainId}>
          <SelectTrigger>
            <SelectValue placeholder="Roadmap" />
          </SelectTrigger>
          <SelectContent>
            {roadmaps.map((r) => (
              <SelectItem key={r.id} value={String(r.id)}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={topicId} onValueChange={setTopicId} disabled={!roadmapId}>
          <SelectTrigger>
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            {(topics.data ?? []).map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        {!topicId ? (
          <EmptyState
            icon={Library}
            title={!domainId ? "Pick a domain" : !roadmapId ? "Pick a roadmap" : "Pick a topic"}
            description="Choose the domain, roadmap, and topic before managing resources."
          />
        ) : resources.isLoading ? (
          <div className="p-4">
            <SkeletonGrid count={3} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Library} title="No resources" description="Add resources to this topic." />
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">URL</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30">
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        TYPE_TONE[r.type],
                      )}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium">{r.title}</td>
                  <td className="px-5 py-3.5 max-w-xs truncate text-muted-foreground">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {r.url}
                    </a>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(r)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete resource?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => remove.mutate(r.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit resource" : "New resource"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" className="mt-1.5" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input id="url" className="mt-1.5" placeholder="https://…" {...form.register("url")} />
              {form.formState.errors.url && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.url.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select
                  value={form.watch("type")}
                  onValueChange={(v) => form.setValue("type", v as ResourceType)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Topic</Label>
                <Select
                  value={form.watch("topicId")}
                  onValueChange={(v) => form.setValue("topicId", v)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Pick topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {(topics.data ?? []).map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" className="mt-1.5" {...form.register("description")} />
            </div>
            <DialogFooter>
              <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={save.isPending} className="bg-gradient-primary text-primary-foreground">
                {save.isPending ? "Saving…" : editing ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
