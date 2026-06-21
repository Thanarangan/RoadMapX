import { Link } from "../lib/router-compat";
import { ArrowRight, Map, BookOpen, Activity, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "../components/BrandLogo";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <BrandLogo className="h-11 shadow-soft" />
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="bg-gradient-primary text-primary-foreground">
              Get started
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Curated by experts · Built for ambitious learners
          </div>
          <h1 className="text-4xl font-semibold tracking-tight leading-[1.05] sm:text-6xl">
            Master any domain with <span className="gradient-text">structured roadmaps</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
            RoadMapX is a premium learning OS — curated domains, expert-built roadmaps, and
            hand-picked resources. Track your progress. Stay in flow.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button
                size="lg"
                className="group bg-gradient-primary text-primary-foreground shadow-elegant"
              >
                Start learning free
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                I have an account
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Map,
              t: "Visual roadmaps",
              d: "Beautiful learning paths from beginner to mastery.",
            },
            {
              icon: BookOpen,
              t: "Curated resources",
              d: "Books, videos, articles — only the best.",
            },
            { icon: Activity, t: "Progress tracking", d: "See exactly where you are, always." },
            {
              icon: ShieldCheck,
              t: "Expert reviewed",
              d: "Every roadmap is vetted by domain experts.",
            },
          ].map((f) => (
            <div
              key={f.t}
              className="rounded-xl border border-border bg-card/70 p-5 backdrop-blur shadow-soft transition-all hover:shadow-elegant hover:-translate-y-0.5"
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-4.5 w-4.5" />
              </div>
              <div className="mt-4 text-sm font-semibold">{f.t}</div>
              <div className="mt-1 text-xs text-muted-foreground">{f.d}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
