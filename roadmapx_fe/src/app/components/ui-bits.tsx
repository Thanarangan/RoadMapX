import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "default" | "success" | "warning" | "accent";
}) {
  const toneClass = {
    default: "from-primary/15 to-primary/0 text-primary",
    success: "from-success/15 to-success/0 text-success",
    warning: "from-warning/20 to-warning/0 text-warning-foreground",
    accent: "from-accent/15 to-accent/0 text-accent",
  }[tone];

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-elegant">
      <div
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-100",
          toneClass,
        )}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
        {delta && (
          <div className="mt-1 text-xs text-muted-foreground">
            <span className="text-success font-medium">{delta}</span> this week
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-secondary text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-44 rounded-xl border border-border bg-card p-5">
          <div className="h-4 w-2/3 rounded shimmer" />
          <div className="mt-3 h-3 w-full rounded shimmer" />
          <div className="mt-2 h-3 w-5/6 rounded shimmer" />
          <div className="mt-6 h-9 w-28 rounded shimmer" />
        </div>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  const map: Record<string, string> = {
    active: "bg-success/15 text-success",
    approved: "bg-success/15 text-success",
    current: "bg-primary/15 text-primary",
    published: "bg-success/15 text-success",
    pending: "bg-warning/20 text-warning-foreground",
    draft: "bg-secondary text-secondary-foreground",
    inactive: "bg-muted text-muted-foreground",
    rejected: "bg-destructive/15 text-destructive",
  };
  const cls = map[s] || "bg-secondary text-secondary-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize",
        cls,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status || "—"}
    </span>
  );
}
