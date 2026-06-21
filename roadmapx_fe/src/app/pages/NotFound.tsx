import { Link } from "../lib/router-compat";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center animate-fade-in">
        <div className="gradient-text text-8xl font-semibold tracking-tighter">404</div>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button className="bg-gradient-primary text-primary-foreground">Go home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
