import { Outlet, useLocation } from "react-router-dom";

import { OwnerNavbar } from "@/components/owner/OwnerNavbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { theme } from "@/lib/theme";

const OwnerLayout = () => {
  const location = useLocation();

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
      <OwnerNavbar />

      {/* Main Layout */}
      <div className="mx-auto mt-10 flex max-w-[1850px] items-start gap-8 px-10">
        {/* Sidebar */}
        <Sidebar
          role="owner"
          active={active}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-150px)] flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;