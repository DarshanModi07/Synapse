import { theme } from "@/lib/theme";
import { EmptyState } from "./EmptyState";

import {
  FolderKanban,
  ArrowRight,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

export const RecentProjects = ({ projects }) => {
  const navigate = useNavigate();
  const { slug } = useParams();

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        title="No Projects"
        description="Create your first project to start managing work."
        icon={FolderKanban}
      />
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#22C55E";

      case "active":
        return "#3B82F6";

      case "pending":
        return "#F59E0B";

      case "cancelled":
        return "#EF4444";

      default:
        return theme.primary;
    }
  };

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

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: theme.text,
            }}
          >
            Recent Projects
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: theme.secondary,
            }}
          >
            Latest projects inside your workspace
          </p>
        </div>

      </div>

      {/* Table */}

      <div className="space-y-4">

        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/workspace/${slug}/projects/${project.id}`)}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/5 px-5 py-5 transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/30 hover:bg-white/5 hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)]"
          >
            {/* Left */}

            <div>

              <h3
                className="text-lg font-semibold"
                style={{
                  color: theme.text,
                }}
              >
                {project.name}
              </h3>

              <p
                className="mt-1 text-sm"
                style={{
                  color: theme.secondary,
                }}
              >
                Due{" "}
                {project.dueDate
                  ? new Date(
                      project.dueDate
                    ).toLocaleDateString()
                  : "--"}
              </p>

            </div>

            {/* Right */}

            <div className="flex items-center gap-5">

              <span
                className="rounded-full px-4 py-2 text-sm font-semibold"
                style={{
                  background: `${getStatusColor(project.status)}20`,
                  color: getStatusColor(project.status),
                }}
              >
                {project.status?.replace("_", " ")}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/workspace/${slug}/projects/${project.id}`);
                }}
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