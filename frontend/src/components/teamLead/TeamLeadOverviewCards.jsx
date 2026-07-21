import { LayoutList, Activity, Eye, CheckCircle, AlertCircle } from "lucide-react";
import { theme } from "@/lib/theme";

const TeamLeadOverviewCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Assigned",
      value: stats?.total || 0,
      icon: LayoutList,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
    {
      title: "In Progress",
      value: stats?.inProgress || 0,
      icon: Activity,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
    },
    {
      title: "Under Review",
      value: stats?.underReview || 0,
      icon: Eye,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20",
    },
    {
      title: "Completed",
      value: stats?.completed || 0,
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },
    {
      title: "Overdue",
      value: stats?.overdue || 0,
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg ${card.border}`}
          style={{ background: theme.card }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">
              {card.title}
            </span>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamLeadOverviewCards;
