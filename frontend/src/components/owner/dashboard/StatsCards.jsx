import {
  Building2,
  Users,
  FolderKanban,
  ListTodo,
  GitBranch,
  BriefcaseBusiness,
} from "lucide-react";

import { StatsCard } from "./StatsCard";

export const StatsCards = ({ overview }) => {
  const cards = [
    {
      title: "Departments",
      value: overview.departments ?? 0,
      icon: Building2,
      color: "#7C3AED",
    },

    {
      title: "Teams",
      value: overview.teams ?? 0,
      icon: Users,
      color: "#2563EB",
    },

    {
      title: "Projects",
      value: overview.projects ?? 0,
      icon: FolderKanban,
      color: "#059669",
    },

    {
      title: "Tasks",
      value: overview.tasks ?? 0,
      icon: ListTodo,
      color: "#F59E0B",
    },

    {
      title: "Sub Tasks",
      value: overview.subtasks ?? 0,
      icon: GitBranch,
      color: "#EC4899",
    },

    {
      title: "Work Items",
      value: overview.workItems ?? 0,
      icon: BriefcaseBusiness,
      color: "#EF4444",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => (
        <StatsCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </section>
  );
};