import {
  Users,
  FolderKanban,
  UserCog,
  CalendarDays,
  ArrowRight,
  Pencil,
  Trash2,
} from "lucide-react";

import { theme } from "@/lib/theme";

const DepartmentCard = ({
  department,
  onOpen,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onOpen(department)}
      className="group cursor-pointer rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.02]"
      style={{
        background: "rgba(13,13,18,.55)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 12px 30px rgba(0,0,0,.25),0 0 28px rgba(124,58,237,.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = "1px solid rgba(167,139,250,.35)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,.35),0 0 40px rgba(124,58,237,.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = "1px solid rgba(167,139,250,.10)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,.25),0 0 28px rgba(124,58,237,.05)";
      }}
    >
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{
              color: theme.text,
            }}
          >
            {department.name}
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: theme.secondary,
            }}
          >
            Department
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(department);
          }}
          className="rounded-xl p-2 transition hover:bg-white/5"
        >
          <ArrowRight
            size={20}
            color={theme.primaryLight}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* Divider */}

      <div
        className="my-6 h-px"
        style={{
          background: "rgba(255,255,255,.05)",
        }}
      />

      {/* Stats */}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCog
              size={18}
              color={theme.primaryLight}
            />

            <span
              style={{
                color: theme.secondary,
              }}
            >
              Manager
            </span>
          </div>

          <span
            className="font-medium"
            style={{
              color: theme.text,
            }}
          >
            {department.manager?.name || "Not Assigned"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users
              size={18}
              color={theme.primaryLight}
            />

            <span
              style={{
                color: theme.secondary,
              }}
            >
              Teams
            </span>
          </div>

          <span
            style={{
              color: theme.text,
            }}
          >
            {department.statistics?.teams ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderKanban
              size={18}
              color={theme.primaryLight}
            />

            <span
              style={{
                color: theme.secondary,
              }}
            >
              Projects
            </span>
          </div>

          <span
            style={{
              color: theme.text,
            }}
          >
            {department.statistics?.projects ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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

          <span
            style={{
              color: theme.text,
            }}
          >
            {department.statistics?.members ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
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
              Created
            </span>
          </div>

          <span
            className="text-sm"
            style={{
              color: theme.text,
            }}
          >
            {new Date(
              department.createdAt
            ).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Footer */}
      {(onEdit || onDelete) && (
        <div className="mt-8 flex gap-3">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(department);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 transition hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.06)",
                color: theme.text,
              }}
            >
              <Pencil size={17} />
              Edit
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(department);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 transition hover:scale-[1.02]"
              style={{
                background: "rgba(255,0,0,.08)",
                border: "1px solid rgba(255,0,0,.15)",
                color: "#FF6B6B",
              }}
            >
              <Trash2 size={17} />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DepartmentCard;