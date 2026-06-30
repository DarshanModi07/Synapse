import { Outlet, useLocation } from "react-router-dom";

import { OwnerNavbar } from "@/components/owner/OwnerNavbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { theme } from "@/lib/theme";

const OwnerLayout = () => {
  const location = useLocation();

  const currentPath = location.pathname.split("/").pop();

  const activeMap = {
    "": "Dashboard",
    departments: "Departments",
    teams: "Teams",
    projects: "Projects",
    members: "Members",
    analytics: "Analytics",
    ai: "AI Insights",
    settings: "Settings",
  };

  let active = activeMap[currentPath];

  // Dashboard Route
  if (/^\/workspace\/[^/]+$/.test(location.pathname)) {
    active = "Dashboard";
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: theme.background,
        color: theme.text,
      }}
    >
      <OwnerNavbar />

      {/* Main Layout */}
      <div className="mx-auto mt-10 flex max-w-[1850px] items-start gap-8 px-10">
        {/* Sidebar */}
        <Sidebar
          role="owner"
          active={active}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-150px)] flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;