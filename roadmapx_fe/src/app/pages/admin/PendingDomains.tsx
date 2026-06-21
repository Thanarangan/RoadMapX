import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Check, Inbox, User, X } from "lucide-react";
import { PageHeader, SkeletonGrid, EmptyState } from "../../components/ui-bits";
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

export default function AdminPendingDomains() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["pending-domains"],
    queryFn: domainService.pending,
  });

  const approve = useMutation({
    mutationFn: (id: number) => domainService.approve(id),
    onSuccess: () => {
      toast.success("Domain approved");
      qc.invalidateQueries({ queryKey: ["pending-domains"] });
      qc.invalidateQueries({ queryKey: ["domains"] });
    },
  });

  const reject = useMutation({
    mutationFn: (id: number) => domainService.reject(id),
    onSuccess: () => {
      toast.success("Domain rejected");
      qc.invalidateQueries({ queryKey: ["pending-domains"] });
    },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Approval queue"
        title="Pending domains"
        description="Review and decide on newly submitted domains."
      />
      {isLoading ? (
        <SkeletonGrid />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Inbox} title="Inbox zero" description="No domains waiting on review." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.map((d) => (
            <DomainApprovalCard
              key={d.id}
              domain={d}
              onApprove={() => approve.mutate(d.id)}
              onReject={() => reject.mutate(d.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DomainApprovalCard({
  domain,
  onApprove,
  onReject,
}: {
  domain: Domain;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-elegant">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight">{domain.name}</h3>
          <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
            {domain.description ?? "No description provided."}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <User className="h-3.5 w-3.5" />
          {domain.createdBy ?? "Unknown"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {domain.createdAt ? new Date(domain.createdAt).toLocaleDateString() : "—"}
        </span>
      </div>
      <div className="mt-5 flex items-center justify-end gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline" className="text-destructive">
              <X className="mr-1 h-3.5 w-3.5" />
              Reject
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject "{domain.name}"?</AlertDialogTitle>
              <AlertDialogDescription>This will mark the domain as rejected.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onReject} className="bg-destructive text-destructive-foreground">
                Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" className="bg-gradient-primary text-primary-foreground">
              <Check className="mr-1 h-3.5 w-3.5" />
              Approve
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve "{domain.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This domain will become available to all students.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onApprove}>Approve</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
