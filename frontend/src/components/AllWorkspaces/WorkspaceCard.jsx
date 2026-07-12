import { theme } from "@/lib/theme";
import { ChevronRight, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WorkspaceCard = ({ workspaceMember }) => {
  const navigate = useNavigate();

  const {
    workspace,
    sys_role,
    work_role,
  } = workspaceMember;

  const handleClick = () => {
    let path = `/workspace/${workspace.slug}`;
    if (sys_role === "manager") {
      path += "/manager";
    } else if (sys_role === "team_lead" || sys_role === "teamLead") {
      path += "/team-lead";
    } else if (sys_role === "employee") {
      path += "/employee";
    }
    navigate(path);
  };

  return (
    <div
      onClick={handleClick}
      className="
        cursor-pointer
        rounded-2xl
        border
        p-6
        transition-all
        duration-200
        hover:border-violet-500
        hover:bg-zinc-900/60
      "
      style={{
        borderColor: theme.border,
        backgroundColor: theme.card,
      }}
    >
      <div className="flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-5">

          {/* Logo */}

          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl"
            style={{
              backgroundColor: "rgba(124,58,237,.12)",
            }}
          >
            {workspace.logo ? (
              <img
                src={workspace.logo}
                alt={workspace.name}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <Building2
                size={28}
                color={theme.primary}
              />
            )}
          </div>

          {/* Workspace */}

          <div>

            <h2 className="text-xl font-semibold">
              {workspace.name}
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color: theme.secondary,
              }}
            >
              {work_role || "Workspace Member"}
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          <span
            className="rounded-full px-3 py-1 text-sm capitalize"
            style={{
              backgroundColor:
                "rgba(124,58,237,.12)",
              color: theme.primary,
            }}
          >
            {sys_role}
          </span>

          <ChevronRight
            color={theme.secondary}
          />

        </div>

      </div>
    </div>
  );
};