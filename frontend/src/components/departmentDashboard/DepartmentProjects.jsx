import {
  FolderKanban,
  CalendarDays,
  Activity,
} from "lucide-react";

import { theme } from "@/lib/theme";

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "#22C55E";

    case "in_progress":
      return "#3B82F6";

    case "pending":
      return "#F59E0B";

    default:
      return theme.secondary;
  }
};

const DepartmentProjects = ({ projects }) => {
  return (
    <section className="space-y-6">
      {/* Header */}

      <div>
        <h2
          className="text-3xl font-bold"
          style={{
            color: theme.text,
          }}
        >
          Projects
        </h2>

        <p
          className="mt-2"
          style={{
            color: theme.secondary,
          }}
        >
          Projects assigned to this department.
        </p>
      </div>

      {/* Empty */}

      {projects.length === 0 && (
        <div
          className="rounded-3xl p-12 text-center"
          style={{
            background: "rgba(13,13,18,.55)",
            border:
              "1px solid rgba(167,139,250,.10)",
          }}
        >
          <FolderKanban
            size={42}
            color={theme.primary}
          />

          <h3
            className="mt-5 text-2xl font-semibold"
            style={{
              color: theme.text,
            }}
          >
            No Projects Assigned
          </h3>

          <p
            className="mt-2"
            style={{
              color: theme.secondary,
            }}
          >
            This department currently has no
            assigned projects.
          </p>
        </div>
      )}

      {/* Projects */}

      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-3xl p-6 transition hover:-translate-y-1"
            style={{
              background:
                "rgba(13,13,18,.55)",
              border:
                "1px solid rgba(167,139,250,.10)",
            }}
          >
            <h3
              className="text-2xl font-semibold"
              style={{
                color: theme.text,
              }}
            >
              {project.name}
            </h3>

            <div
              className="my-5 h-px"
              style={{
                background:
                  "rgba(255,255,255,.06)",
              }}
            />

            {/* Status */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity
                  size={18}
                  color={theme.primary}
                />

                <span
                  style={{
                    color: theme.secondary,
                  }}
                >
                  Status
                </span>
              </div>

              <span
                className="font-semibold capitalize"
                style={{
                  color: statusColor(
                    project.status
                  ),
                }}
              >
                {project.status.replaceAll(
                  "_",
                  " "
                )}
              </span>
            </div>

            {/* Start */}

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarDays
                  size={18}
                  color={theme.primary}
                />

                <span
                  style={{
                    color: theme.secondary,
                  }}
                >
                  Start Date
                </span>
              </div>

              <span
                style={{
                  color: theme.text,
                }}
              >
                {project.startDate
                  ? new Date(
                      project.startDate
                    ).toLocaleDateString()
                  : "--"}
              </span>
            </div>

            {/* Due */}

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarDays
                  size={18}
                  color={theme.primary}
                />

                <span
                  style={{
                    color: theme.secondary,
                  }}
                >
                  Due Date
                </span>
              </div>

              <span
                style={{
                  color: theme.text,
                }}
              >
                {project.dueDate
                  ? new Date(
                      project.dueDate
                    ).toLocaleDateString()
                  : "--"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DepartmentProjects;