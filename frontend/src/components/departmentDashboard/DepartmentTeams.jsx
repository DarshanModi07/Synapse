import {
  Users,
  Crown,
  CalendarDays,
} from "lucide-react";

import { theme } from "@/lib/theme";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const DepartmentTeams = ({ teams, basePath, onViewAll }) => {

    const navigate = useNavigate();
    const { slug } = useParams();
    
    const resolvePath = (teamId) => {
        if (basePath) {
            return `${basePath}/teams/${teamId}`;
        }
        return `/workspace/${slug}/teams/${teamId}`;
    };

  return (
    <section className="space-y-6">

      {/* Heading */}

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-3xl font-bold"
            style={{
              color: theme.text,
            }}
          >
            Teams
          </h2>

          <p
            className="mt-2"
            style={{
              color: theme.secondary,
            }}
          >
            Teams belonging to this department.
          </p>
        </div>
        {onViewAll && (
          <div className="flex w-full sm:w-auto">
            <button
              onClick={onViewAll}
              className="flex-1 rounded-xl px-4 py-2 font-medium transition-all hover:opacity-80 sm:flex-none"
              style={{
                background: "rgba(124,58,237,.15)",
                color: theme.primaryLight,
                border: "1px solid rgba(124,58,237,.3)",
              }}
            >
              View All Teams
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}

      {teams.length === 0 && (
        <div
          className="rounded-3xl p-12 text-center"
          style={{
            background: "rgba(13,13,18,.55)",
            border:
              "1px solid rgba(167,139,250,.10)",
          }}
        >
          <Users
            size={42}
            color={theme.primary}
          />

          <h3
            className="mt-5 text-2xl font-semibold"
            style={{
              color: theme.text,
            }}
          >
            No Teams Found
          </h3>

          <p
            className="mt-2"
            style={{
              color: theme.secondary,
            }}
          >
            This department doesn't have any teams yet.
          </p>
        </div>
      )}

      {/* Team Cards */}

      <div className="grid gap-6 lg:grid-cols-2">

        {teams.map((team) => (

            <div
                key={team.id}
                onClick={() =>
                    navigate(resolvePath(team.id))
                }
                className="group cursor-pointer rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                    background: "rgba(13,13,18,.55)",
                    border: "1px solid rgba(167,139,250,.10)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    boxShadow:
                        "0 12px 30px rgba(0,0,0,.25),0 0 28px rgba(124,58,237,.05)",
                }}
            >
            {/* Name */}

            <div className="flex items-center justify-between">

    <h3
        className="text-2xl font-semibold"
        style={{
            color: theme.text,
        }}
    >
        {team.name}
    </h3>

    <ArrowRight
        size={22}
        color={theme.primaryLight}
        className="transition-transform duration-300 group-hover:translate-x-1"
    />

</div>

            <div
              className="my-5 h-px"
              style={{
                background:
                  "rgba(255,255,255,.06)",
              }}
            />

            {/* Leader */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Crown
                  size={18}
                  color={theme.primary}
                />

                <span
                  style={{
                    color: theme.secondary,
                  }}
                >
                  Team Leader
                </span>

              </div>

              <span
                style={{
                  color: theme.text,
                }}
              >
                {team.leader?.name ??
                  "Not Assigned"}
              </span>

            </div>

            {/* Members */}

            <div className="mt-5 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Users
                  size={18}
                  color={theme.primary}
                />

                <span
                  style={{
                    color: theme.secondary,
                  }}
                >
                  Members
                </span>

              </div>

              <span
                style={{
                  color: theme.text,
                }}
              >
                {team.members}
              </span>

            </div>

            {/* Created */}

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
                  Created
                </span>

              </div>

              <span
                style={{
                  color: theme.text,
                }}
              >
                {new Date(
                  team.createdAt
                ).toLocaleDateString()}
              </span>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default DepartmentTeams;