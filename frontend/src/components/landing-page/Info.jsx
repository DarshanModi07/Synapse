import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Bot,
  FolderKanban,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  Brain,
  Clock3,
  Activity,
  Target,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Workspace Hierarchy",
    description:
      "Organize your organization through Workspaces, Departments, Teams, and Employees.",
  },
  {
    icon: Users,
    title: "Team Management",
    description:
      "Create teams, assign leaders, manage members, and maintain accountability.",
  },
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Create projects, assign responsibilities, define deadlines, and track progress.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Monitor project, team, department, and workspace performance from a unified dashboard.",
  },
  {
    icon: Activity,
    title: "Real-Time Insights",
    description:
      "Understand what teams are working on and identify bottlenecks before they become problems.",
  },
  {
    icon: Brain,
    title: "AI Deadline Prediction",
    description:
      "Predict whether projects are likely to meet deadlines using team activity and progress data.",
  },
  {
    icon: Bot,
    title: "AI Work Suggestions",
    description:
      "Receive recommendations to improve productivity, prioritize tasks, and optimize workflows.",
  },
  {
    icon: Clock3,
    title: "Risk Detection",
    description:
      "Identify delayed projects, inactive teams, and workload imbalances automatically.",
  },
  {
    icon: MessageSquare,
    title: "Group Communication",
    description:
      "Collaborate through workspace-wide, department, and team conversations.",
  },
  {
    icon: Workflow,
    title: "Department Coordination",
    description:
      "Keep departments aligned and ensure smooth collaboration across teams.",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description:
      "Track milestones, objectives, and project completion rates in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Secure your workspace with fine-grained permissions and role management.",
  },
];

export const Info = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28" id="Features">
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          Everything Your Workspace Needs
        </h2>

        <p className="mx-auto max-w-2xl text-zinc-400">
          Synapse brings organization, collaboration, project management,
          and AI assistance into a single workspace.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -6,
              }}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15">
                <Icon className="h-6 w-6 text-violet-400" />
              </div>

              <h3 className="mb-3 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};