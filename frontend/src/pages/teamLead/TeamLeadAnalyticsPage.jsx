import { Brain, Activity, TrendingUp, AlertTriangle, ListTodo, Target } from "lucide-react";

const TeamLeadAnalyticsPage = () => {
  // Mock Data for AI Analytics
  const aiInsights = {
    productivityScore: 88,
    completionRate: 76,
    recommendations: [
      "Reassign 2 tasks from Alice to Bob to balance frontend workload.",
      "Schedule a brief sync for 'Database Migration' project to mitigate timeline risks.",
      "Acknowledge Charlie for completing 5 tasks ahead of schedule this week."
    ],
    risks: [
      "Frontend V2 is approaching deadline with 12 active tasks remaining.",
      "Backend API tasks have seen a 20% increase in blockages."
    ],
    topPerformers: [
      { name: "Charlie Davis", role: "UI/UX Designer", score: 95 },
      { name: "Alice Johnson", role: "Senior Frontend", score: 92 }
    ]
  };

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Team Analytics</h1>
        <p className="text-gray-400">Deep insights into team productivity, performance, and workload.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Productivity Score */}
        <div 
          className="rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-purple-500/20"
          style={{ background: "rgba(13,13,18,.55)", backdropFilter: "blur(20px)" }}
        >
          <Activity className="w-10 h-10 text-purple-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">Productivity Score</h3>
          <div className="text-6xl font-bold text-white mb-2">{aiInsights.productivityScore}</div>
          <p className="text-sm text-green-400 flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" /> +5% from last week
          </p>
        </div>

        {/* Completion Rate */}
        <div 
          className="rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-blue-500/20"
          style={{ background: "rgba(13,13,18,.55)", backdropFilter: "blur(20px)" }}
        >
          <Target className="w-10 h-10 text-blue-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">Completion Rate</h3>
          <div className="text-6xl font-bold text-white mb-2">{aiInsights.completionRate}%</div>
          <p className="text-sm text-gray-400">Of assigned tasks</p>
        </div>

        {/* Top Performers */}
        <div 
          className="rounded-3xl p-8 border border-white/5"
          style={{ background: "rgba(13,13,18,.55)", backdropFilter: "blur(20px)" }}
        >
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-fuchsia-400" /> Top Performers
          </h3>
          <div className="space-y-4">
            {aiInsights.topPerformers.map((performer, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                  <div className="text-sm font-medium text-white">{performer.name}</div>
                  <div className="text-xs text-gray-400">{performer.role}</div>
                </div>
                <div className="text-lg font-bold text-purple-400">{performer.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recommendations */}
        <div 
          className="rounded-3xl p-8 border border-white/5"
          style={{ background: "rgba(13,13,18,.55)", backdropFilter: "blur(20px)" }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-purple-400" /> AI Recommendations
          </h3>
          <ul className="space-y-4">
            {aiInsights.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm bg-white/5 p-4 rounded-xl">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div 
          className="rounded-3xl p-8 border border-red-500/10"
          style={{ background: "rgba(13,13,18,.55)", backdropFilter: "blur(20px)" }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" /> Upcoming Risks
          </h3>
          <ul className="space-y-4">
            {aiInsights.risks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm bg-red-500/10 border border-red-500/10 p-4 rounded-xl">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-red-500 shrink-0" />
                {risk}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default TeamLeadAnalyticsPage;
