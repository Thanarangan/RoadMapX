import { useQuery } from "@tanstack/react-query";
import { PageHeader, StatCard } from "../../components/ui-bits";
import { BarChart3, TrendingUp, Users, Library } from "lucide-react";
import { domainService, roadmapService } from "../../lib/services";
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

export default function AdminAnalytics() {
  const domains = useQuery({ queryKey: ["admin-domains"], queryFn: domainService.listAdmin });
  const roadmaps = useQuery({ queryKey: ["admin-roadmaps"], queryFn: roadmapService.listAdmin });
  const growth = [
    { m: "Now", domains: domains.data?.length ?? 0, roadmaps: roadmaps.data?.length ?? 0 },
  ];
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Platform-wide metrics, growth, and engagement."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Users" value={0} icon={Users} tone="accent" />
        <StatCard label="Total domains" value={domains.data?.length ?? 0} icon={BarChart3} />
        <StatCard label="Total roadmaps" value={roadmaps.data?.length ?? 0} icon={Library} tone="success" />
        <StatCard label="Avg. completion" value="0%" icon={TrendingUp} tone="warning" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-base font-semibold">Domain growth</h3>
          <p className="text-xs text-muted-foreground">Approved domains over time</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growth} margin={{ left: -20, right: 0, top: 10 }}>
                <defs>
                  <linearGradient id="adm-g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="m"
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
                  dataKey="domains"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#adm-g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-base font-semibold">Roadmap growth</h3>
          <p className="text-xs text-muted-foreground">Published roadmaps over time</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth} margin={{ left: -20, right: 0, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="m"
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
                  dataKey="roadmaps"
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
