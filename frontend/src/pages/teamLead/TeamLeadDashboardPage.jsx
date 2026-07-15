import { useTeamLeadDashboard } from "../../hooks/useTeamLeadDashboard";
import { ProgressCard } from "@/components/owner/dashboard/ProgressCard";
import { StatsCard } from "@/components/owner/dashboard/StatsCard";
import { 
  Users,
  FolderKanban,
  ListTodo,
  CheckCircle,
  Clock3,
  Activity,
  CalendarDays,
  Brain,
  SearchCheck,
  AlertCircle,
  Layers
} from "lucide-react";

const TeamLeadDashboardPage = () => {
  const { data, loading, error } = useTeamLeadDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-purple-400 flex flex-col items-center">
          <Activity className="w-10 h-10 animate-pulse mb-4" />
          <span className="text-sm font-medium">Loading Unified Command Center...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-red-400 bg-red-500/10 p-6 rounded-2xl flex flex-col items-center border border-red-500/20">
          <AlertCircle className="w-8 h-8 mb-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const {
    leaderName,
    teams,
    overview,
    projects,
    groupedMembers,
    recentTasks,
    upcomingDeadlines,
    analytics,
    recentActivity
  } = data;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const getStatusColor = (status) => {
    if (status === 'done') return "bg-green-500/10 text-green-400 border-green-500/20";
    if (status === 'in_progress') return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (status === 'in_review') return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* SECTION 1: Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back, {leaderName}</h1>
        <p className="text-gray-400 font-medium text-lg">
          Unified Dashboard · Managing {overview.totalTeamsLed} Team{overview.totalTeamsLed !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-4 mt-6">
          <div className="bg-white/5 px-5 py-2.5 rounded-xl text-sm text-gray-300 border border-white/10 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span><strong className="text-white">{overview.totalMembers}</strong> Total Members</span>
          </div>
          <div className="bg-white/5 px-5 py-2.5 rounded-xl text-sm text-gray-300 border border-white/10 flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-blue-400" />
            <span><strong className="text-white">{overview.totalProjects}</strong> Total Projects</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Overview Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
          <StatsCard title="Teams Led" value={overview.totalTeamsLed} icon={Layers} color="#F43F5E" />
          <StatsCard title="Members" value={overview.totalMembers} icon={Users} color="#8B5CF6" />
          <StatsCard title="Projects" value={overview.totalProjects} icon={FolderKanban} color="#3B82F6" />
          <StatsCard title="Tasks" value={overview.totalTasks} icon={ListTodo} color="#F59E0B" />
          <StatsCard title="Completed" value={overview.completedTasks} icon={CheckCircle} color="#10B981" />
          <StatsCard title="Pending" value={overview.pendingTasks} icon={Clock3} color="#F97316" />
          <StatsCard title="Progress %" value={overview.teamProgress} icon={Activity} color="#14B8A6" />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* SECTION 7: Task Analytics (Using ProgressCard) */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" /> Global Task Analytics
            </h2>
            <ProgressCard progress={{
              overallProgress: overview.teamProgress,
              done: analytics.completed,
              inProgress: analytics.inProgress,
              inReview: analytics.inReview
            }} />
          </section>

          {/* SECTION 4: Recent Tasks */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-blue-400" /> Global Recent Tasks
            </h2>
            <div className="space-y-4">
              {recentTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                  No tasks available.
                </div>
              ) : (
                recentTasks.map(task => (
                  <div key={task.id} className="p-5 rounded-2xl bg-[#0D0D12]/80 backdrop-blur-xl border border-white/10 flex items-center justify-between hover:border-purple-500/30 transition-colors">
                    <div>
                      <h4 className="text-white font-medium text-lg mb-1">{task.name}</h4>
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-400/70" /> {task.teamName}
                        <span className="mx-1">•</span>
                        Assigned by: {task.assignedBy}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(task.status)}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION 5: Team Members grouped by Team */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" /> Members Directory
            </h2>
            <div className="space-y-8">
              {Object.keys(groupedMembers).length === 0 ? (
                <div className="p-6 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                  No team members assigned.
                </div>
              ) : (
                Object.entries(groupedMembers).map(([teamName, teamMembersList]) => (
                  <div key={teamName} className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-300 border-b border-white/10 pb-2">{teamName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teamMembersList.length === 0 ? (
                        <div className="col-span-full p-4 text-sm text-gray-500 bg-white/5 rounded-xl border border-white/5">
                          No members in this team.
                        </div>
                      ) : (
                        teamMembersList.map(member => (
                          <div key={member.id} className="p-4 bg-[#0D0D12]/80 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4">
                            <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl bg-white/10 border border-white/10" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium truncate">{member.name}</h4>
                              <p className="text-xs text-gray-400 truncate mb-1">{member.email}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 capitalize">
                                  {member.role.replace("_", " ")}
                                </span>
                                <span className="text-xs text-gray-400">
                                  <strong className="text-white">{member.activeTasks}</strong> Tasks
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          
          {/* SECTION 3: Team Overview */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" /> Team Overview
            </h2>
            <div className="space-y-4">
              {teams.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No teams assigned.</div>
              ) : (
                teams.map(team => (
                  <div key={team.id} className="p-6 rounded-3xl bg-[#0D0D12]/80 backdrop-blur-xl border border-white/10 space-y-4 transition-all hover:border-purple-500/30">
                    <h3 className="text-white font-semibold text-lg border-b border-white/10 pb-3">{team.name}</h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Members</span>
                      <strong className="text-white">{team.membersCount}</strong>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Projects</span>
                      <strong className="text-white">{team.projectsCount}</strong>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Tasks</span>
                      <strong className="text-purple-400">{team.tasksCount}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION 8: Upcoming Deadlines */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-orange-400" /> Global Deadlines
            </h2>
            <div className="p-6 rounded-3xl bg-[#0D0D12]/80 backdrop-blur-xl border border-white/10 space-y-4">
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No deadlines approaching.</div>
              ) : (
                upcomingDeadlines.map(deadline => {
                  const isOverdue = new Date(deadline.dueDate) < new Date();
                  return (
                    <div key={deadline.id} className={`p-4 rounded-xl border transition-all ${isOverdue ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/5'}`}>
                      <h4 className="text-white font-medium text-sm mb-1">{deadline.name}</h4>
                      <p className="text-xs text-purple-400/80 mb-2">{deadline.teamName}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className={`font-medium ${isOverdue ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                          {new Date(deadline.dueDate).toLocaleDateString()} {isOverdue && '(Overdue)'}
                        </span>
                        <span className={`px-2 py-0.5 rounded capitalize ${getPriorityColor(deadline.priority)}`}>
                          {deadline.priority}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* SECTION 6: Project Overview */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-blue-400" /> Project Portfolio
            </h2>
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="p-6 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                  No projects assigned.
                </div>
              ) : (
                projects.map(project => (
                  <div key={project.id} className="p-5 bg-[#0D0D12]/80 backdrop-blur-xl rounded-2xl border border-white/10 space-y-3 hover:border-blue-500/30 transition-all">
                    <div className="flex justify-between items-start">
                      <h4 className="text-white font-medium truncate flex-1">{project.name}</h4>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{project.teamName}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Completion</span>
                      <strong className="text-white">{project.progress}%</strong>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                    </div>
                    <div className="text-xs text-gray-500 pt-1">
                      Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No date set'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION 9: Recent Activity */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-fuchsia-400" /> Global Activity
            </h2>
            <div className="p-6 rounded-3xl bg-[#0D0D12]/80 backdrop-blur-xl border border-white/10 max-h-[300px] overflow-y-auto">
              {recentActivity.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No recent activity.</div>
              ) : (
                <ul className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                  {recentActivity.map((act) => (
                    <li key={act.id} className="relative flex items-center gap-4 text-sm text-gray-300">
                      <div className="w-4 h-4 rounded-full bg-fuchsia-500 z-10 shrink-0 outline outline-4 outline-[#0D0D12]" /> 
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex-1 shadow-sm">
                        <p>{act.description}</p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {new Date(act.time).toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TeamLeadDashboardPage;