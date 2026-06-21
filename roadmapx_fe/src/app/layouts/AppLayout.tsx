import { useState } from "react";
import { Outlet } from "../lib/router-compat";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
          <TopNav onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
