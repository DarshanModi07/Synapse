import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { OwnerNavbar } from "@/components/owner/OwnerNavbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { theme } from "@/lib/theme";

const OwnerLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  let active = "Dashboard";
  if (location.pathname.includes("/departments")) active = "Departments";
  else if (location.pathname.includes("/teams")) active = "Teams";
  else if (location.pathname.includes("/projects")) active = "Projects";
  else if (location.pathname.includes("/members")) active = "Members";
  else if (location.pathname.includes("/analytics")) active = "Analytics";
  else if (location.pathname.includes("/ai")) active = "AI Insights";
  else if (location.pathname.includes("/settings")) active = "Settings";

  return (
    <div
      className="min-h-screen"
      style={{
        background: theme.background,
        color: theme.text,
      }}
    >
      <OwnerNavbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Layout */}
      <div className="mx-auto mt-6 md:mt-10 flex max-w-[1850px] items-start gap-8 px-4 md:px-10">
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          role="owner"
          active={active}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-150px)] w-full flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;