import { NavLink, useNavigate } from "../lib/router-compat";
import { useAuth } from "../lib/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Compass,
  Map,
  Activity,
  BookOpen,
  PenSquare,
  FileEdit,
  Layers,
  Library,
  Inbox,
  ShieldCheck,
  BarChart3,
  Settings2,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Role } from "../lib/api";
import BrandLogo from "./BrandLogo";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV: Record<Role, NavItem[]> = {
  ROLE_STUDENT: [
    { to: "/student", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/domains", label: "Domains", icon: Compass },
    { to: "/student/roadmaps", label: "Roadmaps", icon: Map },
    { to: "/student/progress", label: "Learning Progress", icon: Activity },
    { to: "/student/resources", label: "Resources", icon: BookOpen },
  ],
  ROLE_CONTENT_MANAGER: [
    { to: "/cm", label: "Dashboard", icon: LayoutDashboard },
    { to: "/cm/create", label: "Create Roadmap", icon: PenSquare },
    { to: "/cm/drafts", label: "Draft Roadmaps", icon: FileEdit },
    { to: "/cm/topics", label: "Topics", icon: Layers },
    { to: "/cm/resources", label: "Resources", icon: Library },
  ],
  ROLE_ADMIN: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/manage", label: "Manage Content", icon: Settings2 },
    { to: "/admin/pending-domains", label: "Pending Domains", icon: Inbox },
    { to: "/admin/pending-roadmaps", label: "Pending Roadmaps", icon: Inbox },
    { to: "/admin/approvals", label: "Approval Center", icon: ShieldCheck },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
};

interface Props {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: Props) {
  const { role, username, logout } = useAuth();
  const navigate = useNavigate();
  const items = role ? NAV[role] : [];

  const Content = (
    <div className="flex h-full flex-col gap-1 bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <BrandLogo className="h-11 max-w-[150px]" />
        </div>
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="rounded-md p-1.5 hover:bg-sidebar-accent lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3">
        <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>
        <nav className="flex flex-col gap-0.5">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split("/").length <= 2}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-primary" />
                  )}
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
            {username?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{username ?? "Guest"}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {role?.replace("ROLE_", "").replace("_", " ").toLowerCase()}
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border lg:block">
        {Content}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-foreground/30 backdrop-blur-sm transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={onClose}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-72 border-r border-sidebar-border transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {Content}
        </aside>
      </div>
    </>
  );
}
