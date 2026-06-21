import { useQueries, useQuery } from "@tanstack/react-query";
import { PageHeader, StatCard } from "../../components/ui-bits";
import { Activity, CheckCircle2, Flame, Trophy } from "lucide-react";
import { domainService, progressService, roadmapService, topicService } from "../../lib/services";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function StudentProgress() {
  const currentDomain = useQuery({ queryKey: ["current-domain"], queryFn: domainService.current });
  const roadmaps = useQuery({
    queryKey: ["roadmaps", currentDomain.data?.id],
    queryFn: () => roadmapService.byDomain(currentDomain.data!.id),
    enabled: !!currentDomain.data?.id,
  });
  const topicQueries = useQueries({
    queries: (roadmaps.data ?? []).map((roadmap) => ({
      queryKey: ["topics", roadmap.id],
      queryFn: () => topicService.byRoadmap(roadmap.id),
      enabled: !!roadmap.id,
    })),
  });
  const progressQueries = useQueries({
    queries: (roadmaps.data ?? []).map((roadmap) => ({
      queryKey: ["progress", roadmap.id],
      queryFn: () => progressService.byRoadmap(roadmap.id),
      enabled: !!roadmap.id,
    })),
  });

  const completedTopics = progressQueries.reduce(
    (sum, query) => sum + (query.data?.filter((p) => p.completed !== false).length ?? 0),
    0,
  );
  const totalTopics = topicQueries.reduce((sum, query) => sum + (query.data?.length ?? 0), 0);
  const completion = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const monthly = [{ month: "Current", topics: completedTopics }];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow={currentDomain.data?.name ?? "No domain selected"}
        title="Learning Progress"
        description="Your progress for the current learning domain."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total completed" value={completedTopics} icon={CheckCircle2} tone="success" />
        <StatCard label="Roadmaps" value={roadmaps.data?.length ?? 0} icon={Flame} tone="warning" />
        <StatCard label="Completion" value={`${completion}%`} icon={Activity} />
        <StatCard label="Achievements" value={completedTopics > 0 ? 1 : 0} icon={Trophy} tone="accent" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <h3 className="text-base font-semibold">Topics completed</h3>
          <p className="text-xs text-muted-foreground">Based on your saved roadmap progress.</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ left: -20, right: 0, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} stroke="var(--color-border)" />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} stroke="var(--color-border)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="topics" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-base font-semibold">Timeline</h3>
          <ul className="mt-4 space-y-4">
            <li className="flex gap-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div>
                <div className="text-xs text-muted-foreground">
                  {completedTopics > 0 ? "Progress saved" : "No activity yet"}
                </div>
                <div className="text-sm font-medium">
                  {completedTopics > 0
                    ? `${completedTopics} topic${completedTopics === 1 ? "" : "s"} completed in this domain.`
                    : "Start a roadmap to build your timeline."}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
