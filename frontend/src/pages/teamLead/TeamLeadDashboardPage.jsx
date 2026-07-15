import { StatsCards } from "@/components/owner/dashboard/StatsCards";
import { ProgressCard } from "@/components/owner/dashboard/ProgressCard";
import { CheckCircle, Activity, Brain } from "lucide-react";

const TeamLeadDashboardPage = () => {
  const overview = {
    departments: 1,
    teams: 1,
    projects: 3,
    tasks: 12
  };

  const progressData = {
    total: 12,
    completed: 8,
    percentage: 66,
  };

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Team Lead Dashboard</h1>
        <p className="text-gray-400">Overview of your team's current performance.</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" /> Snapshot
        </h2>
        <StatsCards overview={overview} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" /> Team Progress
          </h2>
          <ProgressCard progress={progressData} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-fuchsia-400" /> Recent Activity
          </h2>
          <div 
            className="rounded-3xl p-8 h-[220px] overflow-y-auto"
            style={{
              background: "rgba(13,13,18,.55)",
              border: "1px solid rgba(167,139,250,.10)",
              backdropFilter: "blur(20px)"
            }}
          >
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-2 h-2 rounded-full bg-green-500" /> 
                <span><strong>John Doe</strong> completed task <em>"Update API"</em></span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> 
                <span><strong>Jane Smith</strong> started task <em>"Fix Navbar"</em></span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-2 h-2 rounded-full bg-orange-500" /> 
                <span><strong>You</strong> created team <em>"Frontend Devs"</em></span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamLeadDashboardPage;