import { Outlet, useLocation, useParams } from "react-router-dom";

import { OwnerNavbar } from "@/components/owner/OwnerNavbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { theme } from "@/lib/theme";
import { managerConfig } from "@/components/manager/sidebar.config";

const ManagerLayout = () => {
  const location = useLocation();
  const { slug } = useParams();

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
      <OwnerNavbar />

      {/* Main Layout */}
      <div className="mx-auto mt-10 flex max-w-[1850px] items-start gap-8 px-10">
        {/* Sidebar */}
        <Sidebar
          role="manager"
          active={active}
          config={managerConfig}
          basePath={`/workspace/${slug}/manager`}
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