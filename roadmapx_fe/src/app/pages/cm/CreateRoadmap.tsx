import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "../../lib/router-compat";
import { ArrowRight, BookOpen, Check, Loader2, Plus, Save, Send, Trash2 } from "lucide-react";
import { PageHeader } from "../../components/ui-bits";
import {
  domainService,
  resourceService,
  roadmapService,
  topicService,
  type ResourceType,
} from "../../lib/services";
import { useAuth } from "../../lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const TYPES: ResourceType[] = ["PDF", "VIDEO", "ARTICLE", "WEBSITE", "BOOK"];

interface ResourceDraft {
  id?: number;
  title: string;
  url: string;
  type: ResourceType;
  description: string;
}

interface TopicDraft {
  id?: number;
  name: string;
  description: string;
  resources: ResourceDraft[];
}

const emptyResource = (): ResourceDraft => ({
  title: "",
  url: "",
  type: "ARTICLE",
  description: "",
});
const emptyTopic = (): TopicDraft => ({ name: "", description: "", resources: [emptyResource()] });

export default function CmCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { username } = useAuth();
  const draftId = Number(searchParams.get("draftId") || 0);
  const domains = useQuery({ queryKey: ["domains"], queryFn: domainService.list });
  const drafts = useQuery({
    queryKey: ["cm-drafts"],
    queryFn: roadmapService.drafts,
    enabled: !!draftId,
  });
  const [domainId, setDomainId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState<TopicDraft[]>([emptyTopic()]);
  const [removedTopicIds, setRemovedTopicIds] = useState<number[]>([]);
  const [removedResourceIds, setRemovedResourceIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadDraft() {
      if (!draftId || !drafts.data) return;
      const draft = drafts.data.find((roadmap) => roadmap.id === draftId);
      if (!draft) return;

      setDomainId(String(draft.domainId ?? ""));
      setName(draft.name);
      setDescription(draft.description ?? "");

      const loadedTopics = await topicService.byRoadmap(draft.id);
      const nextTopics = await Promise.all(
        loadedTopics.map(async (topic) => ({
          id: topic.id,
          name: topic.name,
          description: topic.description ?? "",
          resources: (await resourceService.byTopic(topic.id)).map((resource) => ({
            id: resource.id,
            title: resource.title,
            url: resource.url,
            type: resource.type,
            description: resource.description ?? "",
          })),
        })),
      );
      setTopics(nextTopics.length > 0 ? nextTopics : [emptyTopic()]);
    }

    loadDraft();
  }, [draftId, drafts.data]);

  const save = useMutation({
    mutationFn: async (mode: "draft" | "review") => {
      if (!domainId || !name.trim() || !description.trim()) {
        throw new Error("Select a domain and fill roadmap details.");
      }
      const validTopics = topics.filter((topic) => topic.name.trim());
      if (validTopics.length === 0) {
        throw new Error("Add at least one topic.");
      }

      const payload = {
        name,
        description,
        domainId: Number(domainId),
        createdBy: username ?? "Content Manager",
      };
      const roadmap = draftId
        ? await roadmapService.update(draftId, payload)
        : await roadmapService.addDraft(payload);

      for (const resourceId of removedResourceIds) {
        await resourceService.remove(resourceId);
      }
      for (const topicId of removedTopicIds) {
        await topicService.remove(topicId);
      }

      for (const topic of validTopics) {
        const savedTopic = topic.id
          ? await topicService
              .update(topic.id, {
                name: topic.name,
                description: topic.description,
                roadMapId: roadmap.id,
              })
              .then(() => ({ ...topic, id: topic.id }))
          : await topicService.add({
              name: topic.name,
              description: topic.description,
              roadMapId: roadmap.id,
            });

        for (const resource of topic.resources.filter((r) => r.title.trim() && r.url.trim())) {
          const resourcePayload = {
            title: resource.title,
            url: resource.url,
            type: resource.type,
            description: resource.description,
            topicId: savedTopic.id,
          };
          if (resource.id) {
            await resourceService.update(resource.id, resourcePayload);
          } else {
            await resourceService.add(resourcePayload);
          }
        }
      }

      if (mode === "review") {
        await roadmapService.submitDraft(roadmap.id);
      }
      return mode;
    },
    onSuccess: (mode) => {
      toast.success(mode === "draft" ? "Draft saved" : "Submitted for admin review");
      navigate(mode === "draft" ? "/cm/drafts" : "/cm");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function updateTopic(index: number, patch: Partial<TopicDraft>) {
    setTopics((current) =>
      current.map((topic, i) => (i === index ? { ...topic, ...patch } : topic)),
    );
  }

  function updateResource(
    topicIndex: number,
    resourceIndex: number,
    patch: Partial<ResourceDraft>,
  ) {
    setTopics((current) =>
      current.map((topic, i) =>
        i === topicIndex
          ? {
              ...topic,
              resources: topic.resources.map((resource, r) =>
                r === resourceIndex ? { ...resource, ...patch } : resource,
              ),
            }
          : topic,
      ),
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="New contribution"
        title="Build a roadmap"
        description="Select a domain, add the roadmap, create topics, attach resources, then save or submit."
      />

      <div className="space-y-5">
        <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">1. Select domain</h2>
          </div>
          <Select value={domainId} onValueChange={setDomainId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose the domain this roadmap belongs to" />
            </SelectTrigger>
            <SelectContent>
              {(domains.data ?? []).map((domain) => (
                <SelectItem key={domain.id} value={String(domain.id)}>
                  {domain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">2. Roadmap details</h2>
          </div>
          <div className="grid gap-4">
            <div>
              <Label>Roadmap name</Label>
              <Input className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                className="mt-1.5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">3. Topics and resources</h2>
            </div>
            <Button
              variant="outline"
              onClick={() => setTopics((current) => [...current, emptyTopic()])}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add topic
            </Button>
          </div>

          <div className="space-y-4">
            {topics.map((topic, topicIndex) => (
              <div
                key={topicIndex}
                className="rounded-lg border border-border bg-background/40 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold">Topic {topicIndex + 1}</div>
                  {topics.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() =>
                        setTopics((current) => {
                          const topicToRemove = current[topicIndex];
                          if (topicToRemove.id)
                            setRemovedTopicIds((ids) => [...ids, topicToRemove.id!]);
                          topicToRemove.resources.forEach((resource) => {
                            if (resource.id) setRemovedResourceIds((ids) => [...ids, resource.id!]);
                          });
                          return current.filter((_, i) => i !== topicIndex);
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-3">
                  <Input
                    placeholder="Topic name"
                    value={topic.name}
                    onChange={(e) => updateTopic(topicIndex, { name: e.target.value })}
                  />
                  <Textarea
                    placeholder="Topic description"
                    value={topic.description}
                    onChange={(e) => updateTopic(topicIndex, { description: e.target.value })}
                  />
                </div>

                <div className="mt-4 space-y-3">
                  {topic.resources.map((resource, resourceIndex) => (
                    <div
                      key={resourceIndex}
                      className="grid gap-2 rounded-md border border-border p-3 lg:grid-cols-[1fr_1fr_150px_auto]"
                    >
                      <Input
                        placeholder="Resource title"
                        value={resource.title}
                        onChange={(e) =>
                          updateResource(topicIndex, resourceIndex, { title: e.target.value })
                        }
                      />
                      <Input
                        placeholder="https://..."
                        value={resource.url}
                        onChange={(e) =>
                          updateResource(topicIndex, resourceIndex, { url: e.target.value })
                        }
                      />
                      <Select
                        value={resource.type}
                        onValueChange={(value) =>
                          updateResource(topicIndex, resourceIndex, { type: value as ResourceType })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 text-destructive"
                        disabled={topic.resources.length === 1}
                        onClick={() => {
                          const resourceToRemove = topic.resources[resourceIndex];
                          if (resourceToRemove.id) {
                            setRemovedResourceIds((ids) => [...ids, resourceToRemove.id!]);
                          }
                          updateTopic(topicIndex, {
                            resources: topic.resources.filter((_, i) => i !== resourceIndex),
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    onClick={() =>
                      updateTopic(topicIndex, { resources: [...topic.resources, emptyResource()] })
                    }
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add resource
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" disabled={save.isPending} onClick={() => save.mutate("draft")}>
            {save.isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Save as draft
          </Button>
          <Button
            disabled={save.isPending}
            onClick={() => save.mutate("review")}
            className="bg-gradient-primary text-primary-foreground"
          >
            {save.isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-1.5 h-4 w-4" />
            )}
            Submit for review
          </Button>
        </div>
      </div>
    </div>
  );
}
