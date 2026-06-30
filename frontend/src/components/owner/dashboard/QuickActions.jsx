import { theme } from "@/lib/theme";

import {
  Building2,
  Users,
  FolderKanban,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";

export const QuickActions = () => {
  const navigate = useNavigate();
  const { workspace } = useWorkspace();

  const actions = [
    {
      title: "Create Department",
      description: "Organize your workspace into departments.",
      icon: Building2,
      path: `/workspace/${workspace?.slug}/departments`,
      color: "#7C3AED",
    },
    {
      title: "Create Team",
      description: "Build teams inside your departments.",
      icon: Users,
      path: `/workspace/${workspace?.slug}/teams`,
      color: "#2563EB",
    },
    {
      title: "Create Project",
      description: "Start a new collaborative project.",
      icon: FolderKanban,
      path: `/workspace/${workspace?.slug}/projects`,
      color: "#10B981",
    },
    {
      title: "AI Insights",
      description: "Analyze workspace productivity using AI.",
      icon: Sparkles,
      path: `/workspace/${workspace?.slug}/ai`,
      color: "#F59E0B",
    },
  ];

  return (
    <div
      className="rounded-3xl p-7"
      style={{
        background: "rgba(13,13,18,.58)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 12px 32px rgba(0,0,0,.30),0 0 32px rgba(124,58,237,.05)",
      }}
    >
      <div className="mb-8">
        <h2
          className="text-xl font-semibold"
          style={{
            color: theme.text,
          }}
        >
          Quick Actions
        </h2>

        <p
          className="mt-1 text-sm"
          style={{
            color: theme.secondary,
          }}
        >
          Frequently used workspace actions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className="group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(255,255,255,.02)",
              border: "1px solid rgba(255,255,255,.05)",
            }}
          >
            {/* Glow */}

            <div
              className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl transition-all duration-300 group-hover:scale-125"
              style={{
                background: `${action.color}22`,
              }}
            />

            <div
              className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: `${action.color}20`,
                color: action.color,
              }}
            >
              <action.icon size={24} />
            </div>

            <h3
              className="text-lg font-semibold"
              style={{
                color: theme.text,
              }}
            >
              {action.title}
            </h3>

            <p
              className="mt-3 text-sm leading-6"
              style={{
                color: theme.secondary,
              }}
            >
              {action.description}
            </p>

            <div
              className="mt-8 flex items-center gap-2 font-medium"
              style={{
                color: action.color,
              }}
            >
              Open

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;