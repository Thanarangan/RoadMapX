import { Link, useNavigate } from "../lib/router-compat";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authService } from "../lib/services";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import BrandLogo from "../components/BrandLogo";

const schema = z.object({
  username: z.string().trim().min(2).max(64),
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(128),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(v: FormValues) {
    try {
      setLoading(true);
      await authService.register({
        username: v.username,
        password: v.password,
        email: v.email,
      });
      await login(v.email, v.password);
      toast.success("Account created. Choose your learning domain.");
      navigate("/student/domains");
    } catch {
      // interceptor toast
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <BrandLogo className="h-11 shadow-soft" />
          </Link>
          <h2 className="text-2xl font-semibold tracking-tight">Create your account</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">Start your learning journey today.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" className="mt-1.5" {...register("username")} />
              {errors.username && (
                <p className="mt-1 text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="mt-1.5" {...register("email")} />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" className="mt-1.5" {...register("password")} />
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-primary-foreground shadow-elegant"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
