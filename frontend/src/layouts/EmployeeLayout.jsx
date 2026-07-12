import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { theme } from "@/lib/theme";
import { employeeConfig } from "@/components/employee/sidebar.config";

const EmployeeLayout = () => {
  const location = useLocation();

  const currentPath = location.pathname.split("/").pop();

  const activeMap = {
    "employee": "Dashboard",
  };

  let active = activeMap[currentPath];

  if (currentPath === "employee") {
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
        <h1 className="text-xl font-semibold">Employee Portal</h1>
      </div>

      {/* Main Layout */}
      <div className="mx-auto mt-10 flex max-w-[1850px] items-start gap-8 px-10">
        {/* Sidebar */}
        <Sidebar
          role="employee"
          active={active}
          config={employeeConfig}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-150px)] flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
