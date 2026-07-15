import { User, Activity, CheckCircle, Mail, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const TeamLeadMembersPage = () => {
  const { slug } = useParams();

  // Mock data for Team Members
  const members = [
    {
      id: "mem_1",
      name: "Alice Johnson",
      role: "Senior Frontend Developer",
      email: "alice@synapse.com",
      location: "San Francisco, CA",
      activeTasks: 3,
      completedTasks: 45,
      performanceScore: 92,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
    },
    {
      id: "mem_2",
      name: "Bob Smith",
      role: "Backend Engineer",
      email: "bob@synapse.com",
      location: "London, UK",
      activeTasks: 5,
      completedTasks: 38,
      performanceScore: 88,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
    },
    {
      id: "mem_3",
      name: "Charlie Davis",
      role: "UI/UX Designer",
      email: "charlie@synapse.com",
      location: "Remote",
      activeTasks: 2,
      completedTasks: 12,
      performanceScore: 95,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie"
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Team Members</h1>
        <p className="text-gray-400">View and monitor members belonging to your assigned teams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex flex-col rounded-3xl p-6 transition-all duration-300 hover:border-purple-500/50"
            style={{
              background: "rgba(13,13,18,.55)",
              border: "1px solid rgba(255,255,255,.05)",
              backdropFilter: "blur(20px)"
            }}
          >
            <div className="flex items-start gap-4 mb-6">
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-purple-400 font-medium">{member.role}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" /> {member.location}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Activity className="w-3 h-3" /> Active Tasks
                </div>
                <div className="text-xl font-bold text-white">{member.activeTasks}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <CheckCircle className="w-3 h-3 text-green-400" /> Completed
                </div>
                <div className="text-xl font-bold text-white">{member.completedTasks}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Performance Score</span>
                <span className={member.performanceScore >= 90 ? "text-green-400" : "text-blue-400"}>
                  {member.performanceScore}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${member.performanceScore >= 90 ? "bg-green-500" : "bg-blue-500"}`} 
                  style={{ width: `${member.performanceScore}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button
                className="flex-1 py-2 rounded-xl text-center text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 transition-colors"
                onClick={() => alert(`View Profile: ${member.name} (Mock)`)}
              >
                View Profile
              </button>
              <button
                className="flex-1 py-2 rounded-xl text-center text-sm font-medium text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                onClick={() => alert(`View Tasks: ${member.name} (Mock)`)}
              >
                Tasks
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamLeadMembersPage;
