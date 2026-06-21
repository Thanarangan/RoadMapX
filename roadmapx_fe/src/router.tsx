import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { Toaster } from "sonner";

import AppLayout from "./app/layouts/AppLayout";
import { AuthProvider, homeForRole, useAuth } from "./app/lib/auth";
import { ThemeProvider } from "./app/lib/theme";
import type { Role } from "./app/lib/api";
import LandingPage from "./app/pages/Landing";
import LoginPage from "./app/pages/Login";
import NotFoundPage from "./app/pages/NotFound";
import RegisterPage from "./app/pages/Register";
import UnauthorizedPage from "./app/pages/Unauthorized";
import AdminAnalytics from "./app/pages/admin/Analytics";
import AdminApprovalCenter from "./app/pages/admin/ApprovalCenter";
import AdminDashboard from "./app/pages/admin/Dashboard";
import AdminManageContent from "./app/pages/admin/ManageContent";
import AdminPendingDomains from "./app/pages/admin/PendingDomains";
import AdminPendingRoadmaps from "./app/pages/admin/PendingRoadmaps";
import CmCreate from "./app/pages/cm/CreateRoadmap";
import CmDashboard from "./app/pages/cm/Dashboard";
import CmDrafts from "./app/pages/cm/Drafts";
import CmResources from "./app/pages/cm/Resources";
import CmTopics from "./app/pages/cm/Topics";
import StudentDashboard from "./app/pages/student/Dashboard";
import StudentDomains from "./app/pages/student/Domains";
import StudentProgress from "./app/pages/student/Progress";
import StudentResources from "./app/pages/student/Resources";
import StudentRoadmapDetails from "./app/pages/student/RoadmapDetails";
import StudentRoadmaps from "./app/pages/student/Roadmaps";
import StudentTopicResources from "./app/pages/student/TopicResources";
import { Navigate } from "./app/lib/router-compat";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
  });

  function RootComponent() {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-right" richColors closeButton />
            <Outlet />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
  }

  function RoleRoute({ allow }: { allow: Role[] }) {
    const { role } = useAuth();
    if (!role) return <Navigate to="/login" replace />;
    if (!allow.includes(role)) return <Navigate to="/unauthorized" replace />;
    return <Outlet />;
  }

  function RoleHome() {
    const { role, isAuthenticated } = useAuth();
    if (!isAuthenticated) return <LandingPage />;
    return <Navigate to={homeForRole(role)} replace />;
  }

  const rootRoute = createRootRoute({
    component: RootComponent,
    notFoundComponent: NotFoundPage,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: RoleHome,
  });

  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: LoginPage,
  });

  const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: RegisterPage,
  });

  const unauthorizedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/unauthorized",
    component: UnauthorizedPage,
  });

  const protectedRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: "protected",
    component: ProtectedRoute,
  });

  const appLayoutRoute = createRoute({
    getParentRoute: () => protectedRoute,
    id: "app-layout",
    component: AppLayout,
  });

  const studentRoleRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    id: "student-role",
    component: () => <RoleRoute allow={["ROLE_STUDENT"]} />,
  });

  const cmRoleRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    id: "cm-role",
    component: () => <RoleRoute allow={["ROLE_CONTENT_MANAGER"]} />,
  });

  const adminRoleRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    id: "admin-role",
    component: () => <RoleRoute allow={["ROLE_ADMIN"]} />,
  });

  const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    unauthorizedRoute,
    protectedRoute.addChildren([
      appLayoutRoute.addChildren([
        studentRoleRoute.addChildren([
          createRoute({
            getParentRoute: () => studentRoleRoute,
            path: "/student",
            component: StudentDashboard,
          }),
          createRoute({
            getParentRoute: () => studentRoleRoute,
            path: "/student/domains",
            component: StudentDomains,
          }),
          createRoute({
            getParentRoute: () => studentRoleRoute,
            path: "/student/roadmaps",
            component: StudentRoadmaps,
          }),
          createRoute({
            getParentRoute: () => studentRoleRoute,
            path: "/student/roadmaps/$roadmapId",
            component: StudentRoadmapDetails,
          }),
          createRoute({
            getParentRoute: () => studentRoleRoute,
            path: "/student/roadmaps/$roadmapId/topic/$topicId",
            component: StudentTopicResources,
          }),
          createRoute({
            getParentRoute: () => studentRoleRoute,
            path: "/student/progress",
            component: StudentProgress,
          }),
          createRoute({
            getParentRoute: () => studentRoleRoute,
            path: "/student/resources",
            component: StudentResources,
          }),
        ]),
        cmRoleRoute.addChildren([
          createRoute({ getParentRoute: () => cmRoleRoute, path: "/cm", component: CmDashboard }),
          createRoute({
            getParentRoute: () => cmRoleRoute,
            path: "/cm/create",
            component: CmCreate,
          }),
          createRoute({
            getParentRoute: () => cmRoleRoute,
            path: "/cm/drafts",
            component: CmDrafts,
          }),
          createRoute({
            getParentRoute: () => cmRoleRoute,
            path: "/cm/topics",
            component: CmTopics,
          }),
          createRoute({
            getParentRoute: () => cmRoleRoute,
            path: "/cm/resources",
            component: CmResources,
          }),
        ]),
        adminRoleRoute.addChildren([
          createRoute({
            getParentRoute: () => adminRoleRoute,
            path: "/admin",
            component: AdminDashboard,
          }),
          createRoute({
            getParentRoute: () => adminRoleRoute,
            path: "/admin/manage",
            component: AdminManageContent,
          }),
          createRoute({
            getParentRoute: () => adminRoleRoute,
            path: "/admin/pending-domains",
            component: AdminPendingDomains,
          }),
          createRoute({
            getParentRoute: () => adminRoleRoute,
            path: "/admin/pending-roadmaps",
            component: AdminPendingRoadmaps,
          }),
          createRoute({
            getParentRoute: () => adminRoleRoute,
            path: "/admin/approvals",
            component: AdminApprovalCenter,
          }),
          createRoute({
            getParentRoute: () => adminRoleRoute,
            path: "/admin/analytics",
            component: AdminAnalytics,
          }),
        ]),
      ]),
    ]),
  ]);

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
