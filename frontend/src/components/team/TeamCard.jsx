import {
  Users,
  FolderKanban,
  Building2,
  UserCog,
  CalendarDays,
  ArrowRight,
  Pencil,
  Trash2,
} from "lucide-react";

import { theme } from "@/lib/theme";

const TeamCard = ({
  team,
  onOpen,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onOpen(team)}
      className="group cursor-pointer rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(13,13,18,.55)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 12px 30px rgba(0,0,0,.25), 0 0 28px rgba(124,58,237,.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{ color: theme.text }}
          >
            {team.name}
          </h2>

          <p
            className="mt-1 text-sm"
            style={{ color: theme.secondary }}
          >
            Team
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(team);
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

      {/* Details */}
      <div className="space-y-4">
        {/* Department */}
        <div className="flex items-center">
          <div className="flex w-40 items-center gap-3">
            <Building2 size={18} color={theme.primaryLight} />
            <span style={{ color: theme.secondary }}>
              Department
            </span>
          </div>

          <span
            className="ml-auto text-right font-medium"
            style={{ color: theme.text }}
          >
            {team.department?.name || "-"}
          </span>
        </div>

        {/* Leader */}
        <div className="flex items-center">
          <div className="flex w-40 items-center gap-3">
            <UserCog size={18} color={theme.primaryLight} />
            <span style={{ color: theme.secondary }}>
              Leader
            </span>
          </div>

          <span
            className="ml-auto text-right font-medium"
            style={{ color: theme.text }}
          >
            {team.leader?.name || "Not Assigned"}
          </span>
        </div>

        {/* Members */}
        <div className="flex items-center">
          <div className="flex w-40 items-center gap-3">
            <Users size={18} color={theme.primaryLight} />
            <span style={{ color: theme.secondary }}>
              Members
            </span>
          </div>

          <span
            className="ml-auto text-right"
            style={{ color: theme.text }}
          >
            {team.statistics?.members ?? 0}
          </span>
        </div>

        {/* Projects */}
        <div className="flex items-center">
          <div className="flex w-40 items-center gap-3">
            <FolderKanban size={18} color={theme.primaryLight} />
            <span style={{ color: theme.secondary }}>
              Projects
            </span>
          </div>

          <span
            className="ml-auto text-right"
            style={{ color: theme.text }}
          >
            {team.statistics?.projects ?? 0}
          </span>
        </div>

        {/* Created */}
        <div className="flex items-center">
          <div className="flex w-40 items-center gap-3">
            <CalendarDays size={18} color={theme.primaryLight} />
            <span style={{ color: theme.secondary }}>
              Created
            </span>
          </div>

          <span
            className="ml-auto text-right text-sm"
            style={{ color: theme.text }}
          >
            {new Date(team.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(team);
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(team);
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
      </div>
    </div>
  );
};

export default TeamCard;