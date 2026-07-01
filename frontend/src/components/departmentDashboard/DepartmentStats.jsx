import {
  Users,
  FolderKanban,
  Building2,
} from "lucide-react";

import { theme } from "@/lib/theme";

const StatCard = ({
  icon: Icon,
  title,
  value,
}) => {
  return (
    <div
      className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(13,13,18,.55)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter:
          "blur(24px)",
      }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          background:
            "rgba(124,58,237,.12)",
        }}
      >
        <Icon
          size={26}
          color={theme.primary}
        />
      </div>

      <p
        className="mt-6 text-sm"
        style={{
          color: theme.secondary,
        }}
      >
        {title}
      </p>

      <h2
        className="mt-2 text-4xl font-bold"
        style={{
          color: theme.text,
        }}
      >
        {value}
      </h2>
    </div>
  );
};

const DepartmentStats = ({
  statistics,
}) => {
  return (
    <section className="grid gap-6 md:grid-cols-3">

      <StatCard
        icon={Building2}
        title="Teams"
        value={statistics.teams}
      />

      <StatCard
        icon={Users}
        title="Members"
        value={statistics.members}
      />

      <StatCard
        icon={FolderKanban}
        title="Projects"
        value={statistics.projects}
      />

    </section>
  );
};

export default DepartmentStats;