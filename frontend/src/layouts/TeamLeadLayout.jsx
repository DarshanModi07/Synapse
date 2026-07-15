import { Outlet, useLocation, useParams } from "react-router-dom";

import { OwnerNavbar } from "@/components/owner/OwnerNavbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { theme } from "@/lib/theme";
import { teamLeadConfig } from "@/components/teamLead/sidebar.config";

const TeamLeadLayout = () => {
  const location = useLocation();
  const { slug } = useParams();

  let active = "Dashboard";
  if (location.pathname.includes("/projects")) active = "Projects";
  else if (location.pathname.includes("/members")) active = "Members";
  else if (location.pathname.includes("/analytics")) active = "Analytics";

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
          role="teamLead"
          active={active}
          config={teamLeadConfig}
          basePath={`/workspace/${slug}/team-lead`}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-150px)] flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeamLeadLayout;
