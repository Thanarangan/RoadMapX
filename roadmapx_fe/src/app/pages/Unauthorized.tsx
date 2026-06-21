import { Link } from "../lib/router-compat";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center animate-fade-in">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You don't have permission to view this page. If you think this is a mistake, contact your
          administrator.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/">
            <Button>Go home</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">Switch account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
