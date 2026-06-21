import { useQuery } from "@tanstack/react-query";
import { Link } from "../../lib/router-compat";
import { FilePlus2, Layers, Library, PenSquare } from "lucide-react";
import { PageHeader, StatCard } from "../../components/ui-bits";
import { roadmapService } from "../../lib/services";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CmDashboard() {
  const drafts = useQuery({ queryKey: ["cm-drafts"], queryFn: roadmapService.drafts });
  const trend = [{ label: "Drafts", roadmaps: drafts.data?.length ?? 0, topics: 0 }];
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Creator workspace"
        title="Content overview"
        description="Track your drafts, published roadmaps, and creator output."
        actions={
          <Link to="/cm/create">
            <Button className="bg-gradient-primary text-primary-foreground shadow-elegant">
              <PenSquare className="mr-1.5 h-4 w-4" />
              New roadmap
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Drafts" value={drafts.data?.length ?? 0} icon={FilePlus2} tone="warning" />
        <StatCard label="Published" value={0} icon={Library} tone="success" />
        <StatCard label="Topics" value={0} icon={Layers} />
        <StatCard label="Resources" value={0} icon={Library} tone="accent" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-base font-semibold">Roadmap creation</h3>
          <p className="text-xs text-muted-foreground">Current backend totals</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: -20, right: 0, top: 10 }}>
                <defs>
                  <linearGradient id="cm-g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  stroke="var(--color-border)"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  stroke="var(--color-border)"
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="roadmaps"
                  stroke="var(--color-primary)"
                  fill="url(#cm-g)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-base font-semibold">Topic output</h3>
          <p className="text-xs text-muted-foreground">Current backend totals</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ left: -20, right: 0, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  stroke="var(--color-border)"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  stroke="var(--color-border)"
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="topics"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
