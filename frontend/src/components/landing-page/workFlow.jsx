import { theme } from "@/lib/theme";
import {
Building2,
Layers3,
Users,
User,
Briefcase,
Brain,
BarChart3,
ArrowRight,
} from "lucide-react";

const organizationFlow = [
{ icon: Building2, title: "Workspace" },
{ icon: Brain, title: "AI Departments" },
{ icon: Layers3, title: "Departments" },
{ icon: Brain, title: "AI Teams" },
{ icon: Users, title: "Teams" },
{ icon: User, title: "Employees" },
];

const executionFlow = [
{ icon: User, title: "Owner" },
{ icon: Briefcase, title: "Project" },
{ icon: Users, title: "Manager" },
{ icon: Brain, title: "AI Tasks" },
{ icon: Users, title: "Team Lead" },
{ icon: Brain, title: "AI Subtasks" },
{ icon: User, title: "Employee" },
{ icon: Brain, title: "AI Work Items" },
{ icon: Brain, title: "AI Reviews" },
{ icon: BarChart3, title: "Analytics" },
];

const FlowRow = ({ title, items }) => {
return (
<div
className="rounded-3xl border p-6"
style={{
backgroundColor: theme.card,
borderColor: theme.border,
}}
>
<h3
className="mb-5 text-lg font-semibold"
style={{ color: theme.text }}
>
{title} </h3>

  <div className="flex flex-wrap items-center justify-center gap-2">
    {items.map((item, index) => {
      const Icon = item.icon;

      return (
        <div
          key={item.title}
          className="flex items-center gap-2"
        >
          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{
              backgroundColor: item.title.includes("AI")
                ? `${theme.primary}12`
                : theme.surface,
              borderColor: item.title.includes("AI")
                ? `${theme.primary}35`
                : theme.border,
            }}
          >
            <Icon
              size={16}
              color={
                item.title.includes("AI")
                  ? theme.primary
                  : theme.secondary
              }
            />

            <span
              className="text-sm font-medium"
              style={{ color: theme.text }}
            >
              {item.title}
            </span>
          </div>

          {index !== items.length - 1 && (
            <ArrowRight
              size={16}
              color={theme.secondary}
            />
          )}
        </div>
      );
    })}
  </div>
</div>


);
};

export const Workflow = () => {
return ( <section
   id="workflow"
   className="mx-auto max-w-7xl px-6 py-20"
 > <div className="mb-12 text-center">
<h2
className="text-4xl font-bold"
style={{ color: theme.text }}
>
How Synapse Works </h2>
    <p
      className="mx-auto mt-4 max-w-3xl"
      style={{ color: theme.secondary }}
    >
      AI assists organizational planning, task decomposition,
      reviews, and project analytics throughout the workflow.
    </p>
  </div>

  <div className="space-y-6">
    <FlowRow
      title="Organization Setup"
      items={organizationFlow}
    />

    <FlowRow
      title="Project Execution & Analytics"
      items={executionFlow}
    />
  </div>
</section>


);
};
