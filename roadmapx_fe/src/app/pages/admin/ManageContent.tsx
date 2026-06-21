import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, FolderPlus, Map, Layers, Library, Trash2 } from "lucide-react";
import { PageHeader, StatusBadge } from "../../components/ui-bits";
import {
  authService,
  domainService,
  resourceService,
  roadmapService,
  topicService,
  type ResourceType,
} from "../../lib/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const cmSchema = z.object({
  username: z.string().trim().min(2).max(64),
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(128),
});
const domainSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(1000),
});
const roadmapSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(2000),
  domainId: z.string().min(1),
  publishMode: z.enum(["draft", "publish"]),
});
const topicSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional(),
  roadMapId: z.string().min(1),
});
const resourceSchema = z.object({
  title: z.string().trim().min(2).max(200),
  url: z.string().trim().url().max(1000),
  type: z.enum(["PDF", "VIDEO", "ARTICLE", "WEBSITE", "BOOK"]),
  topicId: z.string().min(1),
  description: z.string().trim().max(1000).optional(),
});

const TYPES: ResourceType[] = ["PDF", "VIDEO", "ARTICLE", "WEBSITE", "BOOK"];

export default function AdminManageContent() {
  const qc = useQueryClient();
  const domains = useQuery({ queryKey: ["admin-domains"], queryFn: domainService.listAdmin });
  const roadmaps = useQuery({ queryKey: ["admin-roadmaps"], queryFn: roadmapService.listAdmin });
  const selectedRoadmap = useForm<{ roadMapId: string }>({ defaultValues: { roadMapId: "" } });
  const watchedRoadmap = selectedRoadmap.watch("roadMapId");
  const topics = useQuery({
    queryKey: ["topics", Number(watchedRoadmap)],
    queryFn: () => topicService.byRoadmap(Number(watchedRoadmap)),
    enabled: !!watchedRoadmap,
  });

  const cmForm = useForm<z.infer<typeof cmSchema>>({ resolver: zodResolver(cmSchema) });
  const domainForm = useForm<z.infer<typeof domainSchema>>({ resolver: zodResolver(domainSchema) });
  const roadmapForm = useForm<z.infer<typeof roadmapSchema>>({
    resolver: zodResolver(roadmapSchema),
    defaultValues: { publishMode: "draft" },
  });
  const topicForm = useForm<z.infer<typeof topicSchema>>({ resolver: zodResolver(topicSchema) });
  const resourceForm = useForm<z.infer<typeof resourceSchema>>({
    resolver: zodResolver(resourceSchema),
    defaultValues: { type: "ARTICLE" },
  });

  const createCm = useMutation({
    mutationFn: authService.createContentManager,
    onSuccess: (_, v) => {
      toast.success(`Content manager credentials created for ${v.email}`);
      cmForm.reset();
    },
  });
  const createDomain = useMutation({
    mutationFn: domainService.addAdmin,
    onSuccess: () => {
      toast.success("Domain created and published");
      domainForm.reset();
      qc.invalidateQueries({ queryKey: ["pending-domains"] });
      qc.invalidateQueries({ queryKey: ["domains"] });
      qc.invalidateQueries({ queryKey: ["admin-domains"] });
    },
  });
  const createRoadmap = useMutation({
    mutationFn: (v: z.infer<typeof roadmapSchema>) =>
      v.publishMode === "publish"
        ? roadmapService.addAdmin({ name: v.name, description: v.description, domainId: Number(v.domainId) })
        : roadmapService.addDraft({ name: v.name, description: v.description, domainId: Number(v.domainId) }),
    onSuccess: () => {
      toast.success("Roadmap saved");
      roadmapForm.reset({ publishMode: "draft" });
      qc.invalidateQueries({ queryKey: ["cm-drafts"] });
      qc.invalidateQueries({ queryKey: ["admin-roadmaps"] });
      qc.invalidateQueries({ queryKey: ["pending-roadmaps"] });
    },
  });
  const createTopic = useMutation({
    mutationFn: (v: z.infer<typeof topicSchema>) =>
      topicService.add({ name: v.name, description: v.description, roadMapId: Number(v.roadMapId) }),
    onSuccess: () => {
      toast.success("Topic created");
      topicForm.reset();
      qc.invalidateQueries({ queryKey: ["topics"] });
    },
  });
  const createResource = useMutation({
    mutationFn: (v: z.infer<typeof resourceSchema>) =>
      resourceService.add({
        title: v.title,
        url: v.url,
        type: v.type,
        topicId: Number(v.topicId),
        description: v.description,
      }),
    onSuccess: () => {
      toast.success("Resource created");
      resourceForm.reset({ type: "ARTICLE" });
      qc.invalidateQueries({ queryKey: ["resources"] });
    },
  });
  const deleteDomain = useMutation({
    mutationFn: domainService.remove,
    onSuccess: () => {
      toast.success("Domain deleted");
      qc.invalidateQueries({ queryKey: ["admin-domains"] });
      qc.invalidateQueries({ queryKey: ["domains"] });
      qc.invalidateQueries({ queryKey: ["admin-roadmaps"] });
    },
  });
  const deleteRoadmap = useMutation({
    mutationFn: roadmapService.remove,
    onSuccess: () => {
      toast.success("Roadmap deleted");
      qc.invalidateQueries({ queryKey: ["admin-roadmaps"] });
      qc.invalidateQueries({ queryKey: ["pending-roadmaps"] });
      qc.invalidateQueries({ queryKey: ["cm-drafts"] });
    },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Admin tools"
        title="Manage content"
        description="Create content managers and add platform content from one workspace."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Existing domains</h2>
            <span className="text-xs text-muted-foreground">{domains.data?.length ?? 0} total</span>
          </div>
          <div className="max-h-72 overflow-auto rounded-lg border border-border">
            {(domains.data ?? []).length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No domains found.</div>
            ) : (
              <ul className="divide-y divide-border">
                {(domains.data ?? []).map((domain) => (
                  <li key={domain.id} className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="min-w-0 flex-1 truncate text-sm font-medium">{domain.name}</div>
                      <StatusBadge status={domain.status ?? "unknown"} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{domain.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This also deletes roadmaps, topics, and resources under this domain.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => deleteDomain.mutate(domain.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {domain.description ?? "No description"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Existing roadmaps</h2>
            <span className="text-xs text-muted-foreground">{roadmaps.data?.length ?? 0} total</span>
          </div>
          <div className="max-h-72 overflow-auto rounded-lg border border-border">
            {(roadmaps.data ?? []).length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No roadmaps found.</div>
            ) : (
              <ul className="divide-y divide-border">
                {(roadmaps.data ?? []).map((roadmap) => (
                  <li key={roadmap.id} className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="min-w-0 flex-1 truncate text-sm font-medium">{roadmap.name}</div>
                      <StatusBadge status={roadmap.status ?? "unknown"} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{roadmap.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This also deletes topics and resources under this roadmap.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => deleteRoadmap.mutate(roadmap.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {roadmap.description ?? "No description"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <Tabs defaultValue="content-manager">
        <TabsList className="bg-secondary/60">
          <TabsTrigger value="content-manager">Managers</TabsTrigger>
          <TabsTrigger value="domain">Domains</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmaps</TabsTrigger>
          <TabsTrigger value="topic">Topics</TabsTrigger>
          <TabsTrigger value="resource">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="content-manager" className="mt-4">
          <Panel icon={UserPlus} title="Create content manager">
            <form onSubmit={cmForm.handleSubmit((v) => createCm.mutate(v))} className="grid gap-4 sm:grid-cols-3">
              <Field label="Name" error={cmForm.formState.errors.username?.message}>
                <Input {...cmForm.register("username")} />
              </Field>
              <Field label="Email" error={cmForm.formState.errors.email?.message}>
                <Input type="email" {...cmForm.register("email")} />
              </Field>
              <Field label="Password" error={cmForm.formState.errors.password?.message}>
                <Input type="password" {...cmForm.register("password")} />
              </Field>
              <Button className="bg-gradient-primary text-primary-foreground sm:col-span-3" disabled={createCm.isPending}>
                Create credentials
              </Button>
            </form>
          </Panel>
        </TabsContent>

        <TabsContent value="domain" className="mt-4">
          <Panel icon={FolderPlus} title="Create domain">
            <form onSubmit={domainForm.handleSubmit((v) => createDomain.mutate(v))} className="space-y-4">
              <Field label="Domain name" error={domainForm.formState.errors.name?.message}>
                <Input {...domainForm.register("name")} />
              </Field>
              <Field label="Description" error={domainForm.formState.errors.description?.message}>
                <Textarea {...domainForm.register("description")} />
              </Field>
              <Button className="bg-gradient-primary text-primary-foreground" disabled={createDomain.isPending}>
                Create domain
              </Button>
            </form>
          </Panel>
        </TabsContent>

        <TabsContent value="roadmap" className="mt-4">
          <Panel icon={Map} title="Create roadmap">
            <form onSubmit={roadmapForm.handleSubmit((v) => createRoadmap.mutate(v))} className="space-y-4">
              <Field label="Roadmap name" error={roadmapForm.formState.errors.name?.message}>
                <Input {...roadmapForm.register("name")} />
              </Field>
              <Field label="Description" error={roadmapForm.formState.errors.description?.message}>
                <Textarea {...roadmapForm.register("description")} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Domain" error={roadmapForm.formState.errors.domainId?.message}>
                  <Select onValueChange={(v) => roadmapForm.setValue("domainId", v)} value={roadmapForm.watch("domainId")}>
                    <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
                    <SelectContent>
                      {(domains.data ?? []).map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Mode" error={roadmapForm.formState.errors.publishMode?.message}>
                  <Select onValueChange={(v) => roadmapForm.setValue("publishMode", v as "draft" | "publish")} value={roadmapForm.watch("publishMode")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Save draft</SelectItem>
                      <SelectItem value="publish">Publish now</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Button className="bg-gradient-primary text-primary-foreground" disabled={createRoadmap.isPending}>
                Save roadmap
              </Button>
            </form>
          </Panel>
        </TabsContent>

        <TabsContent value="topic" className="mt-4">
          <Panel icon={Layers} title="Create topic">
            <form onSubmit={topicForm.handleSubmit((v) => createTopic.mutate(v))} className="space-y-4">
              <Field label="Roadmap" error={topicForm.formState.errors.roadMapId?.message}>
                <Select onValueChange={(v) => topicForm.setValue("roadMapId", v)} value={topicForm.watch("roadMapId")}>
                  <SelectTrigger><SelectValue placeholder="Select roadmap" /></SelectTrigger>
                  <SelectContent>
                    {(roadmaps.data ?? []).map((r) => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Topic name" error={topicForm.formState.errors.name?.message}>
                <Input {...topicForm.register("name")} />
              </Field>
              <Field label="Description" error={topicForm.formState.errors.description?.message}>
                <Textarea {...topicForm.register("description")} />
              </Field>
              <Button className="bg-gradient-primary text-primary-foreground" disabled={createTopic.isPending}>
                Create topic
              </Button>
            </form>
          </Panel>
        </TabsContent>

        <TabsContent value="resource" className="mt-4">
          <Panel icon={Library} title="Create resource">
            <form onSubmit={resourceForm.handleSubmit((v) => createResource.mutate(v))} className="space-y-4">
              <Field label="Roadmap">
                <Select onValueChange={(v) => selectedRoadmap.setValue("roadMapId", v)} value={watchedRoadmap}>
                  <SelectTrigger><SelectValue placeholder="Select roadmap" /></SelectTrigger>
                  <SelectContent>
                    {(roadmaps.data ?? []).map((r) => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Topic" error={resourceForm.formState.errors.topicId?.message}>
                  <Select onValueChange={(v) => resourceForm.setValue("topicId", v)} value={resourceForm.watch("topicId")} disabled={!watchedRoadmap}>
                    <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                    <SelectContent>
                      {(topics.data ?? []).map((t) => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Type" error={resourceForm.formState.errors.type?.message}>
                  <Select onValueChange={(v) => resourceForm.setValue("type", v as ResourceType)} value={resourceForm.watch("type")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Title" error={resourceForm.formState.errors.title?.message}>
                <Input {...resourceForm.register("title")} />
              </Field>
              <Field label="URL" error={resourceForm.formState.errors.url?.message}>
                <Input {...resourceForm.register("url")} />
              </Field>
              <Field label="Description" error={resourceForm.formState.errors.description?.message}>
                <Textarea {...resourceForm.register("description")} />
              </Field>
              <Button className="bg-gradient-primary text-primary-foreground" disabled={createResource.isPending}>
                Create resource
              </Button>
            </form>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-5 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
