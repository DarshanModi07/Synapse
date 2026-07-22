import {
  FolderKanban,
  CalendarDays,
  CircleDot,
} from "lucide-react";

import { theme } from "@/lib/theme";

const getStatusColor = (status) => {

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

const TeamProjects = ({
  projects = [],
}) => {

  return (

    <div
      className="rounded-3xl p-8"
      style={{
        background: "rgba(13,13,18,.55)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >

      {/* Header */}

      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">

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
            Projects assigned to this team.
          </p>

        </div>

        <div className="flex w-full sm:w-auto">
          <div
            className="flex-1 rounded-xl px-4 py-2 text-center sm:flex-none sm:text-left"
            style={{
              background: "rgba(124,58,237,.12)",
              color: theme.primaryLight,
            }}
          >
            {projects.length} Projects
          </div>
        </div>

      </div>

      {

        projects.length === 0

          ?

          (

            <div
              className="py-16 text-center"
              style={{
                color: theme.secondary,
              }}
            >

              No projects assigned.

            </div>

          )

          :

          (

            <div className="space-y-4">

              {

                projects.map(project => (

                  <div

                    key={project.id}

                    className="rounded-2xl p-6 transition-all duration-300 hover:bg-white/5"

                    style={{
                      border:
                        "1px solid rgba(255,255,255,.05)",
                    }}

                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <h3
                          className="flex items-center gap-3 text-xl font-semibold"
                          style={{
                            color: theme.text,
                          }}
                        >

                          <FolderKanban
                            size={20}
                            color={theme.primaryLight}
                          />

                          {project.name}

                        </h3>

                        {

                          project.description && (

                            <p
                              className="mt-3 max-w-3xl"
                              style={{
                                color: theme.secondary,
                              }}
                            >

                              {project.description}

                            </p>

                          )

                        }

                      </div>

                      <span

                        className="rounded-full px-4 py-2 text-sm font-semibold"

                        style={{
                          background:
                            getStatusColor(project.status),
                          color: "#fff",
                        }}

                      >

                        {project.status}

                      </span>

                    </div>

                    <div
                      className="mt-6 grid gap-5 md:grid-cols-3"
                    >

                      <div
                        className="flex items-center gap-2"
                        style={{
                          color: theme.secondary,
                        }}
                      >

                        <CalendarDays size={16} />

                        Start

                        <span
                          style={{
                            color: theme.text,
                          }}
                        >

                          {

                            project.startDate

                              ?

                              new Date(
                                project.startDate
                              ).toLocaleDateString()

                              :

                              "-"

                          }

                        </span>

                      </div>

                      <div
                        className="flex items-center gap-2"
                        style={{
                          color: theme.secondary,
                        }}
                      >

                        <CalendarDays size={16} />

                        Due

                        <span
                          style={{
                            color: theme.text,
                          }}
                        >

                          {

                            project.dueDate

                              ?

                              new Date(
                                project.dueDate
                              ).toLocaleDateString()

                              :

                              "-"

                          }

                        </span>

                      </div>

                      <div
                        className="flex items-center gap-2"
                        style={{
                          color: theme.secondary,
                        }}
                      >

                        <CircleDot
                          size={16}
                          color={theme.primaryLight}
                        />

                        Progress

                        <span
                          style={{
                            color: theme.text,
                          }}
                        >

                          {project.progress ?? 0}%

                        </span>

                      </div>

                    </div>

                    {/* Progress */}

                    <div
                      className="mt-6 h-2 overflow-hidden rounded-full"
                      style={{
                        background:
                          "rgba(255,255,255,.06)",
                      }}
                    >

                      <div

                        className="h-full rounded-full transition-all duration-500"

                        style={{
                          width: `${project.progress ?? 0}%`,
                          background:
                            "linear-gradient(90deg,#7C3AED,#A78BFA)",
                        }}

                      />

                    </div>

                  </div>

                ))

              }

            </div>

          )

      }

    </div>

  );

};

export default TeamProjects;