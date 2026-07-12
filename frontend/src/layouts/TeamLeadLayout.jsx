import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { theme } from "@/lib/theme";
import { teamLeadConfig } from "@/components/teamLead/sidebar.config";

const TeamLeadLayout = () => {
  const location = useLocation();

  const currentPath = location.pathname.split("/").pop();

  const activeMap = {
    "team-lead": "Dashboard",
  };

  let active = activeMap[currentPath];

  if (currentPath === "team-lead") {
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
        <h1 className="text-xl font-semibold">Team Lead Portal</h1>
      </div>

      {/* Main Layout */}
      <div className="mx-auto mt-10 flex max-w-[1850px] items-start gap-8 px-10">
        {/* Sidebar */}
        <Sidebar
          role="teamLead"
          active={active}
          config={teamLeadConfig}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-150px)] flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeamLeadLayout;
