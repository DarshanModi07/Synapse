import {
  Users,
  Mail,
  CalendarDays,
  Building2,
} from "lucide-react";

import { theme } from "@/lib/theme";

const DepartmentMembers = ({ members }) => {
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
          Department Members
        </h2>

        <p
          className="mt-2"
          style={{
            color: theme.secondary,
          }}
        >
          Members currently working in this department.
        </p>
      </div>

      {/* Empty State */}

      {members.length === 0 && (
        <div
          className="rounded-3xl p-14 text-center"
          style={{
            background: "rgba(13,13,18,.55)",
            border:
              "1px solid rgba(167,139,250,.10)",
          }}
        >
          <Users
            size={44}
            color={theme.primary}
          />

          <h3
            className="mt-6 text-2xl font-semibold"
            style={{
              color: theme.text,
            }}
          >
            No Members Found
          </h3>

          <p
            className="mt-2"
            style={{
              color: theme.secondary,
            }}
          >
            This department doesn't have any
            members yet.
          </p>
        </div>
      )}

      {/* Members */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(13,13,18,.55)",
              border:
                "1px solid rgba(167,139,250,.10)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter:
                "blur(24px)",
              boxShadow:
                "0 12px 30px rgba(0,0,0,.25),0 0 28px rgba(124,58,237,.05)",
            }}
          >
            {/* Avatar */}

            <div className="flex items-center gap-4">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      "rgba(124,58,237,.12)",
                  }}
                >
                  <Users
                    size={28}
                    color={theme.primary}
                  />
                </div>
              )}

              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{
                    color: theme.text,
                  }}
                >
                  {member.name}
                </h3>

                <p
                  className="text-sm"
                  style={{
                    color: theme.secondary,
                  }}
                >
                  Team Member
                </p>
              </div>
            </div>

            <div
              className="my-6 h-px"
              style={{
                background:
                  "rgba(255,255,255,.05)",
              }}
            />

            {/* Email */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  color={theme.primaryLight}
                />

                <span
                  style={{
                    color: theme.secondary,
                  }}
                >
                  Email
                </span>
              </div>

              <span
                className="max-w-[170px] truncate text-right"
                style={{
                  color: theme.text,
                }}
              >
                {member.email}
              </span>
            </div>

            {/* Team */}

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2
                  size={18}
                  color={theme.primaryLight}
                />

                <span
                  style={{
                    color: theme.secondary,
                  }}
                >
                  Team
                </span>
              </div>

              <span
                style={{
                  color: theme.text,
                }}
              >
                {member.team?.name ??
                  "Not Assigned"}
              </span>
            </div>

            {/* Joined */}

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarDays
                  size={18}
                  color={theme.primaryLight}
                />

                <span
                  style={{
                    color: theme.secondary,
                  }}
                >
                  Joined
                </span>
              </div>

              <span
                style={{
                  color: theme.text,
                }}
              >
                {new Date(
                  member.joinedAt
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DepartmentMembers;