import {
  CheckSquare,
  CalendarDays,
  Flag,
  User,
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

const getPriorityColor = (priority) => {

  switch (priority?.toLowerCase()) {

    case "high":
      return "#EF4444";

    case "medium":
      return "#F59E0B";

    case "low":
      return "#22C55E";

    default:
      return theme.secondary;

  }

};

const TeamTasks = ({
  tasks = [],
}) => {

  return (

    <div
      className="rounded-3xl p-8"
      style={{
        background: "rgba(13,13,18,.55)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
      }}
    >

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2
            className="text-3xl font-bold"
            style={{
              color: theme.text,
            }}
          >
            Team Tasks
          </h2>

          <p
            className="mt-2"
            style={{
              color: theme.secondary,
            }}
          >
            Tasks currently assigned to this team.
          </p>

        </div>

        <div
          className="rounded-xl px-4 py-2"
          style={{
            background: "rgba(124,58,237,.12)",
            color: theme.primaryLight,
          }}
        >
          {tasks.length} Tasks
        </div>

      </div>

      {

        tasks.length === 0

          ?

          (

            <div
              className="py-16 text-center"
              style={{
                color: theme.secondary,
              }}
            >

              No tasks found.

            </div>

          )

          :

          (

            <div className="space-y-4">

              {

                tasks.map(task => (

                  <div

                    key={task.id}

                    className="rounded-2xl p-5 transition-all duration-300 hover:bg-white/5"

                    style={{
                      border:
                        "1px solid rgba(255,255,255,.05)",
                    }}

                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <h3
                          className="flex items-center gap-3 text-lg font-semibold"
                          style={{
                            color: theme.text,
                          }}
                        >

                          <CheckSquare
                            size={18}
                            color={theme.primaryLight}
                          />

                          {task.title}

                        </h3>

                        {

                          task.description && (

                            <p
                              className="mt-2 max-w-2xl"
                              style={{
                                color: theme.secondary,
                              }}
                            >

                              {task.description}

                            </p>

                          )

                        }

                      </div>

                      <div className="flex gap-2">

                        <span
                          className="rounded-full px-3 py-1 text-sm font-medium"
                          style={{
                            background:
                              getStatusColor(task.status),
                            color: "#fff",
                          }}
                        >

                          {task.status}

                        </span>

                        <span
                          className="rounded-full px-3 py-1 text-sm font-medium"
                          style={{
                            background:
                              getPriorityColor(task.priority),
                            color: "#fff",
                          }}
                        >

                          {task.priority}

                        </span>

                      </div>

                    </div>

                    <div
                      className="mt-5 flex flex-wrap gap-8 text-sm"
                      style={{
                        color: theme.secondary,
                      }}
                    >

                      <div className="flex items-center gap-2">

                        <User size={15} />

                        {task.assignee?.name || "Unassigned"}

                      </div>

                      <div className="flex items-center gap-2">

                        <CalendarDays size={15} />

                        {

                          task.dueDate

                            ?

                            new Date(
                              task.dueDate
                            ).toLocaleDateString()

                            :

                            "No Due Date"

                        }

                      </div>

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

export default TeamTasks;