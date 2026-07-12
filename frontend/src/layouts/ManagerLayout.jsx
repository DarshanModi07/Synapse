import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { theme } from "@/lib/theme";
import { managerConfig } from "@/components/manager/sidebar.config";

const ManagerLayout = () => {
  const location = useLocation();

  const currentPath = location.pathname.split("/").pop();

  const activeMap = {
    manager: "Dashboard",
    teams: "Teams",
    projects: "Projects",
    members: "Members",
    tasks: "Tasks",
    analytics: "Analytics",
    settings: "Settings",
  };

  let active = activeMap[currentPath];

  // Dashboard Route
  if (currentPath === "manager") {
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
      <div className="h-16 border-b border-white/10 flex items-center px-10">
        <h1 className="text-xl font-semibold">Manager Portal</h1>
      </div>

      {/* Main Layout */}
      <div className="mx-auto mt-10 flex max-w-[1850px] items-start gap-8 px-10">
        {/* Sidebar */}
        <Sidebar
          role="manager"
          active={active}
          config={managerConfig}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-150px)] flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;