import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layers, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { PageHeader, EmptyState, SkeletonGrid } from "../../components/ui-bits";
import { domainService, roadmapService, topicService, type Topic } from "../../lib/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional(),
  roadMapId: z.string().min(1, "Pick a roadmap"),
});
type FormValues = z.infer<typeof schema>;

export default function CmTopics() {
  const qc = useQueryClient();
  const domains = useQuery({ queryKey: ["domains"], queryFn: domainService.list });
  const drafts = useQuery({ queryKey: ["cm-drafts"], queryFn: roadmapService.drafts });
  const [domainId, setDomainId] = useState<string>("");
  const [activeRoadmap, setActiveRoadmap] = useState<string>("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);

  const topics = useQuery({
    queryKey: ["topics", Number(activeRoadmap)],
    queryFn: () => topicService.byRoadmap(Number(activeRoadmap)),
    enabled: !!activeRoadmap,
  });
  const activeRoadmaps = useQuery({
    queryKey: ["roadmaps", Number(domainId)],
    queryFn: () => roadmapService.byDomain(Number(domainId)),
    enabled: !!domainId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", roadMapId: "" },
  });

  function openCreate() {
    setEditing(null);
    form.reset({ name: "", description: "", roadMapId: activeRoadmap });
    setOpen(true);
  }

  function openEdit(t: Topic) {
    setEditing(t);
    form.reset({
      name: t.name,
      description: t.description ?? "",
      roadMapId: String(t.roadMapId ?? activeRoadmap),
    });
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: (v: FormValues) => {
      const payload = { name: v.name, description: v.description, roadMapId: Number(v.roadMapId) };
      return editing ? topicService.update(editing.id, payload) : topicService.add(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Topic updated" : "Topic created");
      qc.invalidateQueries({ queryKey: ["topics"] });
      setOpen(false);
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => topicService.remove(id),
    onSuccess: () => {
      toast.success("Topic deleted");
      qc.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  const filtered = (topics.data ?? []).filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()),
  );
  const roadmaps = [
    ...(activeRoadmaps.data ?? []),
    ...(drafts.data ?? []).filter((r) => !domainId || String(r.domainId) === domainId),
  ].filter((roadmap, index, all) => all.findIndex((item) => item.id === roadmap.id) === index);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Content"
        title="Topics"
        description="Manage topics across your roadmaps."
        actions={
          <Button
            onClick={openCreate}
            disabled={!activeRoadmap}
            className="bg-gradient-primary text-primary-foreground"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add topic
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={domainId}
            onValueChange={(value) => {
              setDomainId(value);
              setActiveRoadmap("");
            }}
          >
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Choose a domain" />
            </SelectTrigger>
            <SelectContent>
              {(domains.data ?? []).map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={activeRoadmap} onValueChange={setActiveRoadmap} disabled={!domainId}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Choose a roadmap" />
            </SelectTrigger>
            <SelectContent>
              {roadmaps.map((r) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search topics…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        {!activeRoadmap ? (
          <EmptyState
            icon={Layers}
            title={domainId ? "Pick a roadmap" : "Pick a domain"}
            description={
              domainId
                ? "Choose a roadmap above to view and edit its topics."
                : "Choose a domain first, then pick one of its draft roadmaps."
            }
          />
        ) : topics.isLoading ? (
          <div className="p-4">
            <SkeletonGrid count={3} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No topics yet"
            description="Add your first topic to start building this roadmap."
            action={<Button onClick={openCreate}>Add topic</Button>}
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30">
                  <td className="px-5 py-3.5 font-medium">{t.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground max-w-md truncate">
                    {t.description ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(t)}>
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
                            <AlertDialogTitle>Delete "{t.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove this topic and its resources.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => remove.mutate(t.id)}
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
            <DialogTitle>{editing ? "Edit topic" : "New topic"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update topic details." : "Add a new topic to this roadmap."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" className="mt-1.5" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
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
                {save.isPending ? "Saving…" : editing ? "Save changes" : "Create topic"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
