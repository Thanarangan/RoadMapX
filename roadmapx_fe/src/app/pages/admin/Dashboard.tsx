import { useQuery } from "@tanstack/react-query";
import { Link } from "../../lib/router-compat";
import { ShieldCheck, Inbox, CheckCircle2, Library } from "lucide-react";
import { PageHeader, StatCard } from "../../components/ui-bits";
import { domainService, roadmapService } from "../../lib/services";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["var(--color-success)", "var(--color-warning)", "var(--color-destructive)"];

export default function AdminDashboard() {
  const pendingD = useQuery({ queryKey: ["pending-domains"], queryFn: domainService.pending });
  const pendingR = useQuery({
    queryKey: ["pending-roadmaps"],
    queryFn: roadmapService.pendingAdmin,
  });
  const domains = useQuery({ queryKey: ["admin-domains"], queryFn: domainService.listAdmin });
  const roadmaps = useQuery({ queryKey: ["admin-roadmaps"], queryFn: roadmapService.listAdmin });
  const trend = [{ d: "Now", approved: domains.data?.length ?? 0, rejected: 0 }];
  const pie = [
    { name: "Approved domains", v: domains.data?.length ?? 0 },
    { name: "Pending domains", v: pendingD.data?.length ?? 0 },
    { name: "Pending roadmaps", v: pendingR.data?.length ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Operations"
        title="Admin overview"
        description="Approve content, monitor health, and grow the platform."
        actions={
          <Link to="/admin/approvals">
            <Button className="bg-gradient-primary text-primary-foreground shadow-elegant">
              <ShieldCheck className="mr-1.5 h-4 w-4" />
              Approval center
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Pending domains"
          value={pendingD.data?.length ?? 0}
          icon={Inbox}
          tone="warning"
        />
        <StatCard
          label="Pending roadmaps"
          value={pendingR.data?.length ?? 0}
          icon={Inbox}
          tone="warning"
        />
        <StatCard
          label="Approved domains"
          value={domains.data?.length ?? 0}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Roadmaps"
          value={roadmaps.data?.length ?? 0}
          icon={Library}
          tone="accent"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-base font-semibold">Approval status</h3>
          <p className="text-xs text-muted-foreground">Current backend totals</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ left: -20, right: 0, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="d"
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
                <Bar dataKey="approved" fill="var(--color-success)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="rejected" fill="var(--color-destructive)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-base font-semibold">Status breakdown</h3>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="v" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {pie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 text-sm">
            {pie.map((p, i) => (
              <li key={p.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="flex-1">{p.name}</span>
                <span className="font-medium">{p.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
