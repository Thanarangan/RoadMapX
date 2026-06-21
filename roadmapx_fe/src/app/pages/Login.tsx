import { Link, useNavigate } from "../lib/router-compat";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useAuth, homeForRole } from "../lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(4, "Password is required").max(128),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);
      const role = await login(values.email, values.password);
      navigate(homeForRole(role));
    } catch {
      // toast already shown by interceptor
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <div className="hidden flex-col justify-between border-r border-border p-12 lg:flex">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[15px] font-semibold tracking-tight">RoadMapX</div>
              <div className="text-[11px] text-muted-foreground -mt-0.5">Learning OS</div>
            </div>
          </div>
          <div className="max-w-md">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Premium learning platform
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight leading-[1.1]">
              The fastest way to master any <span className="gradient-text">domain</span>.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Curated roadmaps, hand-picked resources, and a learning OS designed for ambitious
              students, creators, and teams.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
              {[
                ["12+", "Domains"],
                ["80+", "Roadmaps"],
                ["10k", "Learners"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-xl font-semibold tracking-tight">{v}</div>
                  <div className="text-xs text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RoadMapX. All rights reserved.
          </div>
        </div>

        {/* Form */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-sm animate-fade-in">
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary">
                <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <span className="text-[15px] font-semibold">RoadMapX</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to continue your learning journey.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="leo@example.com"
                  className="mt-1.5"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Forgot?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="mt-1.5"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group w-full bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-elegant"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New to RoadMapX?{" "}
              <Link to="/register" className="font-medium text-foreground hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
