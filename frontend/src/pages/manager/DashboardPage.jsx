import { useNavigate } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useManagerDepartments } from "@/hooks/useManagerDepartments";

import { theme } from "@/lib/theme";
import DepartmentCard from "@/components/department/DepartmentCard";
import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/owner/dashboard/EmptyState";

const ManagerDashboardPage = () => {
  const navigate = useNavigate();
  const { workspace } = useWorkspace();
  const { departments, loading } = useManagerDepartments(workspace?.id);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="mb-8">
        <h2
          className="text-3xl font-bold"
          style={{ color: theme.text }}
        >
          My Departments
        </h2>
        <p
          className="mt-2"
          style={{ color: theme.secondary }}
        >
          Select a department to view its dashboard.
        </p>
      </div>

      {!departments || departments.length === 0 ? (
        <EmptyState
          title="No Departments Assigned"
          description="You have not been assigned as a manager to any departments yet."
          icon={Building2}
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              onOpen={() => navigate(`/workspace/${workspace?.slug}/manager/departments/${dept.id}`)}
              onEdit={undefined}
              onDelete={undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerDashboardPage;
