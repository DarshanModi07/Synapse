import React, { useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";

import { OwnerNavbar } from "@/components/owner/OwnerNavbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { theme } from "@/lib/theme";
import { employeeConfig } from "@/components/employee/sidebar.config";

const EmployeeLayout = () => {
  const location = useLocation();
  const { slug } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  let active = "Dashboard";
  if (location.pathname.includes("/tasks")) active = "Tasks";
  else if (location.pathname.includes("/analytics")) active = "Analytics";

  return (
    <div
      className="h-screen overflow-hidden flex flex-col"
      style={{
        background: theme.background,
        color: theme.text,
      }}
    >
      <div className="flex-none pt-0 md:pt-5">
        <OwnerNavbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Main Layout */}
      <div className="mx-auto mt-6 md:mt-10 flex max-w-[1850px] items-start gap-8 px-4 md:px-10 flex-1 overflow-hidden w-full pb-6 md:pb-10 relative">
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className="flex-none h-full">
          <Sidebar
            role="employee"
            active={active}
            config={employeeConfig}
            basePath={`/workspace/${slug}/employee`}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Page Content */}
        <main className="h-full w-full flex-1 min-w-0 overflow-y-auto custom-scrollbar pr-2 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
