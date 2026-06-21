import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Inbox, X } from "lucide-react";
import { PageHeader, SkeletonGrid, EmptyState, StatusBadge } from "../../components/ui-bits";
import { domainService, roadmapService } from "../../lib/services";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminApprovalCenter() {
  const qc = useQueryClient();
  const pendingD = useQuery({ queryKey: ["pending-domains"], queryFn: domainService.pending });
  const pendingR = useQuery({
    queryKey: ["pending-roadmaps"],
    queryFn: roadmapService.pendingAdmin,
  });

  const approveD = useMutation({
    mutationFn: (id: number) => domainService.approve(id),
    onSuccess: () => {
      toast.success("Domain approved");
      qc.invalidateQueries({ queryKey: ["pending-domains"] });
    },
  });
  const rejectD = useMutation({
    mutationFn: (id: number) => domainService.reject(id),
    onSuccess: () => {
      toast.success("Domain rejected");
      qc.invalidateQueries({ queryKey: ["pending-domains"] });
    },
  });
  const approveR = useMutation({
    mutationFn: (id: number) => roadmapService.approve(id),
    onSuccess: () => {
      toast.success("Roadmap approved");
      qc.invalidateQueries({ queryKey: ["pending-roadmaps"] });
    },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Workflow"
        title="Approval center"
        description="Unified queue for domains and roadmaps awaiting your review."
      />

      <Tabs defaultValue="domains">
        <TabsList className="bg-secondary/60">
          <TabsTrigger value="domains">
            Domains
            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {pendingD.data?.length ?? 0}
            </span>
          </TabsTrigger>
          <TabsTrigger value="roadmaps">
            Roadmaps
            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {pendingR.data?.length ?? 0}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="mt-4">
          {pendingD.isLoading ? (
            <SkeletonGrid />
          ) : !pendingD.data?.length ? (
            <EmptyState icon={Inbox} title="No pending domains" />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-soft">
              {pendingD.data.map((d) => (
                <li key={d.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">{d.name}</div>
                      <StatusBadge status={d.status || "pending"} />
                    </div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {d.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => rejectD.mutate(d.id)}
                    >
                      <X className="mr-1 h-3.5 w-3.5" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-primary text-primary-foreground"
                      onClick={() => approveD.mutate(d.id)}
                    >
                      <Check className="mr-1 h-3.5 w-3.5" /> Approve
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="roadmaps" className="mt-4">
          {pendingR.isLoading ? (
            <SkeletonGrid />
          ) : !pendingR.data?.length ? (
            <EmptyState icon={Inbox} title="No pending roadmaps" />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-soft">
              {pendingR.data.map((r) => (
                <li key={r.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">{r.name}</div>
                      <StatusBadge status={r.status || "pending"} />
                    </div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {r.description}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-primary text-primary-foreground"
                    onClick={() => approveR.mutate(r.id)}
                  >
                    <Check className="mr-1 h-3.5 w-3.5" /> Approve
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
