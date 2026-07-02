import {
  Users,
  Building2,
  UserCog,
  CalendarDays,
} from "lucide-react";

import { theme } from "@/lib/theme";

const TeamDashboardHeader = ({
  team,
  statistics,
}) => {

  return (

    <div
      className="rounded-3xl p-8"
      style={{
        background: "rgba(13,13,18,.55)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 12px 30px rgba(0,0,0,.25),0 0 28px rgba(124,58,237,.05)",
      }}
    >

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <h1
            className="text-4xl font-bold"
            style={{
              color: theme.text,
            }}
          >
            {team.name}
          </h1>

          <p
            className="mt-3 text-lg"
            style={{
              color: theme.secondary,
            }}
          >
            Team Dashboard
          </p>

        </div>

        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg,#7C3AED,#A78BFA)",
          }}
        >

          <Users
            size={30}
            color="#fff"
          />

        </div>

      </div>

      {/* Divider */}

      <div
        className="my-8 h-px"
        style={{
          background:
            "rgba(255,255,255,.05)",
        }}
      />

      {/* Information */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {/* Department */}

        <div>

          <div className="mb-3 flex items-center gap-2">

            <Building2
              size={18}
              color={theme.primaryLight}
            />

            <span
              style={{
                color: theme.secondary,
              }}
            >
              Department
            </span>

          </div>

          <h3
            className="text-lg font-semibold"
            style={{
              color: theme.text,
            }}
          >
            {team.department?.name}
          </h3>

        </div>

        {/* Leader */}

        <div>

          <div className="mb-3 flex items-center gap-2">

            <UserCog
              size={18}
              color={theme.primaryLight}
            />

            <span
              style={{
                color: theme.secondary,
              }}
            >
              Team Leader
            </span>

          </div>

          <h3
            className="text-lg font-semibold"
            style={{
              color: theme.text,
            }}
          >
            {team.leader?.name || "Not Assigned"}
          </h3>

        </div>

        {/* Members */}

        <div>

          <div className="mb-3 flex items-center gap-2">

            <Users
              size={18}
              color={theme.primaryLight}
            />

            <span
              style={{
                color: theme.secondary,
              }}
            >
              Members
            </span>

          </div>

          <h3
            className="text-lg font-semibold"
            style={{
              color: theme.text,
            }}
          >
            {statistics.members}
          </h3>

        </div>

        {/* Created */}

        <div>

          <div className="mb-3 flex items-center gap-2">

            <CalendarDays
              size={18}
              color={theme.primaryLight}
            />

            <span
              style={{
                color: theme.secondary,
              }}
            >
              Created
            </span>

          </div>

          <h3
            className="text-lg font-semibold"
            style={{
              color: theme.text,
            }}
          >
            {new Date(
              team.createdAt
            ).toLocaleDateString()}
          </h3>

        </div>

      </div>

    </div>

  );

};

export default TeamDashboardHeader;