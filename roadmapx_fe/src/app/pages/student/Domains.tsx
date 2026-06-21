import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Compass, Plus, Sparkles } from "lucide-react";
import { PageHeader, EmptyState, SkeletonGrid, StatusBadge } from "../../components/ui-bits";
import { domainService, type Domain } from "../../lib/services";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "../../lib/router-compat";

const ICONS = ["AI", "DEV", "UX", "DATA", "SCI", "IDEA", "OPS", "SEC", "MATH", "GOAL"];

export default function StudentDomains() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["domains"], queryFn: domainService.list });
  const current = useQuery({ queryKey: ["current-domain"], queryFn: domainService.current });

  const selectMutation = useMutation({
    mutationFn: (id: number) => domainService.addToUser(id),
    onSuccess: () => {
      toast.success("Current domain updated");
      qc.invalidateQueries({ queryKey: ["current-domain"] });
      qc.invalidateQueries({ queryKey: ["roadmaps"] });
      navigate("/student");
    },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Explore"
        title="Choose your domain"
        description="Pick one active domain to focus your dashboard, roadmaps, and progress."
      />

      {isLoading ? (
        <SkeletonGrid />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No domains available yet"
          description="Check back soon. New domains are added regularly."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((d, i) => (
            <DomainCard
              key={d.id}
              domain={d}
              icon={ICONS[i % ICONS.length]}
              isCurrent={current.data?.id === d.id}
              onSelect={() => selectMutation.mutate(d.id)}
              loading={selectMutation.isPending && selectMutation.variables === d.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DomainCard({
  domain,
  icon,
  isCurrent,
  onSelect,
  loading,
}: {
  domain: Domain;
  icon: string;
  isCurrent: boolean;
  onSelect: () => void;
  loading: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-primary opacity-10 blur-2xl transition-opacity group-hover:opacity-20" />
      <div className="relative flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-xs font-semibold">
          {icon}
        </div>
        <StatusBadge
          status={isCurrent ? "current" : domain.status || (domain.active ? "active" : "pending")}
        />
      </div>
      <h3 className="relative mt-5 text-lg font-semibold tracking-tight">{domain.name}</h3>
      <p className="relative mt-1.5 line-clamp-2 text-sm text-muted-foreground">
        {domain.description ?? "Explore curated roadmaps in this domain."}
      </p>
      <div className="relative mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Available domain
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant={isCurrent ? "outline" : "default"}
              className={isCurrent ? "" : "bg-gradient-primary text-primary-foreground"}
              disabled={isCurrent}
            >
              {isCurrent ? (
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              ) : (
                <Plus className="mr-1 h-3.5 w-3.5" />
              )}
              {isCurrent ? "Current" : "Choose"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Choose {domain.name} as your current domain?</AlertDialogTitle>
              <AlertDialogDescription>
                Your dashboard, roadmaps, and progress will focus on this domain. You can switch
                later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onSelect} disabled={loading}>
                {loading ? "Saving..." : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
