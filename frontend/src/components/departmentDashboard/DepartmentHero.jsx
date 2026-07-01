import {
  Building2,
  Briefcase,
  UserCog,
  CalendarDays,
} from "lucide-react";

import { theme } from "@/lib/theme";

const DepartmentHero = ({ department }) => {
  return (
    <section
      className="rounded-3xl p-8"
      style={{
        background: "rgba(13,13,18,.55)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        {/* Left */}

        <div className="flex items-center gap-5">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(124,58,237,.12)",
            }}
          >
            <Building2
              size={30}
              color={theme.primary}
            />
          </div>

          <div>
            <h1
              className="text-4xl font-bold"
              style={{
                color: theme.text,
              }}
            >
              {department.name}
            </h1>

            <p
              className="mt-2"
              style={{
                color: theme.secondary,
              }}
            >
              Department Dashboard
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <div
              className="flex items-center gap-2 text-sm"
              style={{
                color: theme.secondary,
              }}
            >
              <Briefcase size={16} />

              Workspace
            </div>

            <p
              className="mt-2 text-lg font-semibold"
              style={{
                color: theme.text,
              }}
            >
              {department.workspace.name}
            </p>
          </div>

          <div>
            <div
              className="flex items-center gap-2 text-sm"
              style={{
                color: theme.secondary,
              }}
            >
              <UserCog size={16} />

              Manager
            </div>

            <p
              className="mt-2 text-lg font-semibold"
              style={{
                color: theme.text,
              }}
            >
              {department.manager?.name ??
                "Not Assigned"}
            </p>
          </div>

          <div>
            <div
              className="flex items-center gap-2 text-sm"
              style={{
                color: theme.secondary,
              }}
            >
              <CalendarDays size={16} />

              Created
            </div>

            <p
              className="mt-2 text-lg font-semibold"
              style={{
                color: theme.text,
              }}
            >
              {new Date(
                department.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentHero;