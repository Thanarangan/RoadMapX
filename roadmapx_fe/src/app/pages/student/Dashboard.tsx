import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "../../lib/router-compat";
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Flame,
  Map,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, StatCard } from "../../components/ui-bits";
import { useAuth } from "../../lib/auth";
import { domainService, progressService, roadmapService, topicService } from "../../lib/services";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  const { username } = useAuth();
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
  const activeDomain = currentDomain.data;
  const totalTopics = topicQueries.reduce((sum, query) => sum + (query.data?.length ?? 0), 0);
  const completedTopics = progressQueries.reduce(
    (sum, query) => sum + (query.data?.filter((p) => p.completed !== false).length ?? 0),
    0,
  );
  const completion = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const weekly = [{ day: "Now", minutes: 0 }];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow={`Welcome back, ${username ?? "learner"}`}
        title="Today's learning"
        description="Your curated learning OS — pick up where you left off."
        actions={
          <Link to="/student/domains">
            <Button className="bg-gradient-primary text-primary-foreground shadow-elegant">
              <Compass className="mr-1.5 h-4 w-4" />
              Explore domains
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Completion" value={`${completion}%`} icon={TrendingUp} />
        <StatCard label="Topics done" value={completedTopics} icon={CheckCircle2} tone="success" />
        <StatCard label="Roadmaps" value={roadmaps.data?.length ?? 0} icon={Flame} tone="warning" />
        <StatCard label="Resources" value={0} icon={BookOpen} tone="accent" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Continue learning */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Continue learning
              </div>
              <h3 className="mt-1 text-lg font-semibold tracking-tight">
                {activeDomain?.name ?? "No domain selected"}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                {activeDomain?.description ??
                  "Choose a domain to start building your learning path."}
              </p>
            </div>
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Roadmap progress</span>
              <span className="font-semibold">{completion}%</span>
            </div>
            <Progress value={completion} className="h-2" />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{completedTopics} topics complete</span>
              <span>{totalTopics} total topics</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link to={activeDomain ? "/student/roadmaps" : "/student/domains"}>
              <Button className="bg-gradient-primary text-primary-foreground">
                {activeDomain ? "Resume learning" : "Choose domain"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/student/progress">
              <Button variant="outline">View progress</Button>
            </Link>
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Achievements</h3>
            <Award className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-3">
            {[
              {
                name: "First domain",
                desc: "Join your first learning domain",
                done: !!activeDomain,
              },
              {
                name: "First roadmap",
                desc: "Open your first path",
                done: (roadmaps.data?.length ?? 0) > 0,
              },
              { name: "First topic", desc: "Complete your first topic", done: completedTopics > 0 },
            ].map((b) => (
              <div
                key={b.name}
                className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3"
              >
                <div
                  className={`grid h-9 w-9 place-items-center rounded-lg ${
                    b.done
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Award className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{b.name}</div>
                  <div className="text-[11px] text-muted-foreground">{b.desc}</div>
                </div>
                {b.done && <CheckCircle2 className="h-4 w-4 text-success" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Weekly learning</h3>
              <p className="text-xs text-muted-foreground">Minutes spent learning this week</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold tracking-tight">0m</div>
              <div className="text-[11px] text-muted-foreground">No activity yet</div>
            </div>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly} margin={{ left: -20, right: 0, top: 10 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="day"
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
                  dataKey="minutes"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent activity</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div className="min-w-0 flex-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">No activity </span>
                  <span className="font-medium">Start learning to see updates here.</span>
                </div>
                <div className="text-[11px] text-muted-foreground">Current account</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
