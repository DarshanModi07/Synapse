import { Outlet, useLocation, useParams } from "react-router-dom";

import { OwnerNavbar } from "@/components/owner/OwnerNavbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { theme } from "@/lib/theme";
import { employeeConfig } from "@/components/employee/sidebar.config";

const EmployeeLayout = () => {
  const location = useLocation();
  const { slug } = useParams();

  let active = "Dashboard";
  if (location.pathname.includes("/tasks")) active = "Tasks";
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
          role="employee"
          active={active}
          config={employeeConfig}
          basePath={`/workspace/${slug}/employee`}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-150px)] flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
