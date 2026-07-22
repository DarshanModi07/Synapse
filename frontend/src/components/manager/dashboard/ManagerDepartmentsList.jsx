import { theme } from "@/lib/theme";
import { EmptyState } from "@/components/owner/dashboard/EmptyState";

import {
  Building2,
  ArrowRight,
  Users
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export const ManagerDepartmentsList = ({ departments, workspaceSlug }) => {
  const navigate = useNavigate();

  if (!departments || departments.length === 0) {
    return (
      <EmptyState
        title="No Departments Assigned"
        description="You have not been assigned as a manager to any departments yet."
        icon={Building2}
      />
    );
  }

  return (
    <div
      className="rounded-3xl p-7"
      style={{
        background: "rgba(13,13,18,.58)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 12px 32px rgba(0,0,0,.30),0 0 32px rgba(124,58,237,.05)",
      }}
    >
      {/* Header */}

      <div className="mb-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: theme.text,
            }}
          >
            My Departments
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: theme.secondary,
            }}
          >
            Departments managed by you
          </p>
        </div>
      </div>

      {/* Table */}

      <div className="space-y-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl px-5 py-5 transition-all duration-300 hover:bg-white/[0.03]"
            style={{
              border: "1px solid rgba(255,255,255,.05)",
            }}
          >
            {/* Left */}

            <div>
              <h3
                className="text-lg font-semibold"
                style={{
                  color: theme.text,
                }}
              >
                {dept.name}
              </h3>

              <p
                className="mt-1 text-sm"
                style={{
                  color: theme.secondary,
                }}
              >
                Created{" "}
                {dept.createdAt
                  ? new Date(
                      dept.createdAt
                    ).toLocaleDateString()
                  : "--"}
              </p>
            </div>

            {/* Right */}

            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-5">
              <span
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                style={{
                  background: `${theme.primaryLight}20`,
                  color: theme.primaryLight,
                }}
              >
                <Users size={16} />
                {dept.statistics?.members || 0} Members
              </span>

              <button
                onClick={() =>
                  navigate(
                    `/workspace/${workspaceSlug}/manager/departments/${dept.id}`
                  )
                }
                className="transition hover:scale-110"
                style={{
                  color: theme.primary,
                }}
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
