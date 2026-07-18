import React from 'react';
import { useTeamLeadDashboard } from "../../hooks/useTeamLeadDashboard";
import { Activity, AlertCircle, Users, FolderKanban, ListTodo, CheckCircle2, LayoutGrid, Clock, CalendarDays, BarChart as BarChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Cell as PieCell } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

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
        <div className="text-red-400 bg-red-500/10 p-6 rounded-[14px] flex flex-col items-center border border-red-500/20">
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

  const statItems = [
      { label: "Teams Led", value: overview.totalTeamsLed, icon: <Users size={18} className="text-blue-400" /> },
      { label: "Members", value: overview.totalMembers, icon: <Users size={18} className="text-indigo-400" /> },
      { label: "Projects", value: overview.totalProjects, icon: <LayoutGrid size={18} className="text-fuchsia-400" /> },
      { label: "Tasks", value: overview.totalTasks, icon: <FolderKanban size={18} className="text-purple-400" /> },
      { label: "Completed", value: overview.completedTasks, icon: <CheckCircle2 size={18} className="text-emerald-400" /> },
      { label: "Pending", value: overview.pendingTasks, icon: <ListTodo size={18} className="text-orange-400" /> },
      { label: "Progress %", value: `${overview.teamProgress || 0}%`, icon: <Activity size={18} className="text-emerald-400" /> }
  ];

  const renderTableData = (value, colorClass = "text-[#F9FAFB]") => (
      <td className={`p-3 text-[13px] ${colorClass} whitespace-nowrap text-right font-medium`}>
          {value}
      </td>
  );

  return (
    <div className="space-y-6 pb-20 max-w-[1400px] mx-auto mt-4">
      
      {/* SECTION 1: Welcome Header */}
      <div>
        <h1 className="text-[32px] font-bold tracking-tight text-[#F9FAFB] mb-2">Welcome Back, {leaderName}</h1>
        <p className="text-[#6B7280] font-medium text-[15px]">
          Unified Dashboard · Managing {overview.totalTeamsLed} Team{overview.totalTeamsLed !== 1 ? 's' : ''}
        </p>
      </div>

      {/* SECTION 2: Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {statItems.map((item, idx) => (
              <div key={idx} className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-4 flex flex-col justify-between hover:border-purple-500/30 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[13px] font-medium text-[#6B7280] group-hover:text-[#F9FAFB] transition-colors">{item.label}</h3>
                      <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                          {item.icon}
                      </div>
                  </div>
                  <div className="text-[24px] font-bold text-[#F9FAFB]">{item.value}</div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (approx 8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* SECTION 7: Task Analytics (WITH CHART) */}
          <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-5 hover:border-purple-500/30 transition-colors">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h2 className="text-[14px] font-bold text-[#F9FAFB]">Global Task Analytics</h2>
                      <p className="text-[12px] text-[#6B7280]">Overall progress across all teams</p>
                  </div>
                  <div className="p-2 bg-purple-500/10 rounded-full">
                      <BarChartIcon size={18} className="text-purple-400" />
                  </div>
              </div>
              
              <div className="h-[200px] w-full mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                          { name: 'Completed', value: analytics.completed, color: '#10B981' },
                          { name: 'In Progress', value: analytics.inProgress, color: '#3B82F6' },
                          { name: 'In Review', value: analytics.inReview, color: '#8B5CF6' }
                      ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                          <Tooltip cursor={{ fill: '#ffffff0a' }} contentStyle={{ backgroundColor: '#13111C', borderColor: '#2D2B45', borderRadius: '10px' }} itemStyle={{ color: '#F9FAFB' }} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                              { [ '#10B981', '#3B82F6', '#8B5CF6' ].map((color, index) => <Cell key={`cell-${index}`} fill={color} />) }
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#2D2B45]">
                  <div><span className="text-[12px] font-medium text-[#6B7280] block mb-1">Overall Progress</span><span className="text-[20px] font-bold text-emerald-400">{overview.teamProgress}%</span></div>
                  <div><span className="text-[12px] font-medium text-[#6B7280] block mb-1">Completed</span><span className="text-[16px] font-semibold text-[#F9FAFB]">{analytics.completed}</span></div>
                  <div><span className="text-[12px] font-medium text-[#6B7280] block mb-1">In Progress</span><span className="text-[16px] font-semibold text-[#F9FAFB]">{analytics.inProgress}</span></div>
                  <div><span className="text-[12px] font-medium text-[#6B7280] block mb-1">In Review</span><span className="text-[16px] font-semibold text-[#F9FAFB]">{analytics.inReview}</span></div>
              </div>
          </div>

          {/* SECTION 4: Recent Tasks */}
          <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm hover:border-purple-500/30 transition-colors overflow-hidden">
              <div className="p-5 border-b border-[#2D2B45] flex justify-between items-center">
                  <div>
                      <h2 className="text-[14px] font-bold text-[#F9FAFB]">Global Recent Tasks</h2>
                      <p className="text-[12px] text-[#6B7280]">Latest tasks assigned across all teams</p>
                  </div>
              </div>
              {recentTasks.length === 0 ? (
                  <div className="p-6 text-center text-[#6B7280] text-[13px] bg-[#08070F]">No tasks available.</div>
              ) : (
                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                          <thead>
                              <tr className="border-b border-[#2D2B45] bg-[#08070F]">
                                  <th className="p-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Task</th>
                                  <th className="p-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Team</th>
                                  <th className="p-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Assigner</th>
                                  <th className="p-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Priority</th>
                                  <th className="p-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                              </tr>
                          </thead>
                          <tbody>
                              {recentTasks.map((task, idx) => (
                                  <tr key={task.id} className="border-b border-[#2D2B45] hover:bg-[#1a1825] transition-colors bg-[#13111C]">
                                      <td className="p-3 text-[13px] text-[#F9FAFB] font-medium">{task.name}</td>
                                      <td className="p-3 text-[13px] text-[#6B7280]">{task.teamName}</td>
                                      <td className="p-3 text-[13px] text-[#6B7280]">{task.assignedBy}</td>
                                      <td className="p-3 text-[13px] text-[#6B7280] capitalize">{task.priority}</td>
                                      <td className="p-3 text-[13px] text-[#6B7280] capitalize">{task.status.replace("_", " ")}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>

          {/* SECTION 5: Team Members */}
          <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm hover:border-purple-500/30 transition-colors overflow-hidden">
              <div className="p-5 border-b border-[#2D2B45] flex justify-between items-center">
                  <div>
                      <h2 className="text-[14px] font-bold text-[#F9FAFB]">Members Directory</h2>
                      <p className="text-[12px] text-[#6B7280]">All team members under your leadership</p>
                  </div>
              </div>
              {Object.keys(groupedMembers).length === 0 ? (
                  <div className="p-6 text-center text-[#6B7280] text-[13px] bg-[#08070F]">No team members assigned.</div>
              ) : (
                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                          <thead>
                              <tr className="border-b border-[#2D2B45] bg-[#08070F]">
                                  <th className="p-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider w-10"></th>
                                  <th className="p-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Name</th>
                                  <th className="p-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Team</th>
                                  <th className="p-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Role</th>
                                  <th className="p-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Tasks</th>
                              </tr>
                          </thead>
                          <tbody>
                              {Object.entries(groupedMembers).map(([teamName, teamMembersList]) => (
                                  teamMembersList.map((member, idx) => (
                                      <tr key={member.id} className="border-b border-[#2D2B45] hover:bg-[#1a1825] transition-colors bg-[#13111C]">
                                          <td className="p-3">
                                              <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full bg-[#2D2B45] object-cover" />
                                          </td>
                                          <td className="p-3 text-[13px] text-[#F9FAFB] font-medium">
                                              {member.name} <span className="text-[#6B7280] ml-1 text-[11px] block sm:inline">{member.email}</span>
                                          </td>
                                          <td className="p-3 text-[13px] text-[#6B7280]">{teamName}</td>
                                          <td className="p-3 text-[13px] text-[#6B7280] capitalize">{member.role.replace("_", " ")}</td>
                                          <td className="p-3 text-[13px] text-[#6B7280]">{member.activeTasks}</td>
                                      </tr>
                                  ))
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>

        </div>

        {/* RIGHT COLUMN (approx 4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* SECTION 3: Team Overview */}
          <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-5 hover:border-purple-500/30 transition-colors">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h2 className="text-[14px] font-bold text-[#F9FAFB]">Team Overview</h2>
                      <p className="text-[12px] text-[#6B7280]">Members and tasks per team</p>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-full">
                      <Users size={18} className="text-blue-400" />
                  </div>
              </div>
              {teams.length === 0 ? (
                  <div className="text-center text-[#6B7280] py-6 text-[13px] bg-[#08070F] rounded-[10px] border border-[#2D2B45]">No teams assigned.</div>
              ) : (
                  <div className="border border-[#2D2B45] rounded-[10px] overflow-hidden">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="bg-[#08070F] border-b border-[#2D2B45]">
                                  <th className="p-3 text-[11px] font-semibold text-[#6B7280] uppercase">Team</th>
                                  <th className="p-3 text-[11px] font-semibold text-[#6B7280] uppercase text-right">Members</th>
                                  <th className="p-3 text-[11px] font-semibold text-[#6B7280] uppercase text-right">Tasks</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2D2B45]">
                              {teams.map((team, idx) => (
                                  <tr key={team.id} className="hover:bg-[#1a1825] transition-colors bg-[#13111C]">
                                      <td className="p-3 text-[13px] text-[#F9FAFB] font-medium">{team.name}</td>
                                      {renderTableData(team.membersCount, "text-[#6B7280]")}
                                      {renderTableData(team.tasksCount, "text-purple-400")}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>

          {/* SECTION 8: Upcoming Deadlines */}
          <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-5 hover:border-purple-500/30 transition-colors">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h2 className="text-[14px] font-bold text-[#F9FAFB]">Global Deadlines</h2>
                      <p className="text-[12px] text-[#6B7280]">Approaching due dates</p>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded-full">
                      <CalendarDays size={18} className="text-yellow-400" />
                  </div>
              </div>
              {upcomingDeadlines.length === 0 ? (
                  <div className="text-center text-[#6B7280] py-6 text-[13px] bg-[#08070F] rounded-[10px] border border-[#2D2B45]">No deadlines approaching.</div>
              ) : (
                  <div className="border border-[#2D2B45] rounded-[10px] overflow-hidden">
                      <table className="w-full text-left">
                          <tbody className="divide-y divide-[#2D2B45]">
                              {upcomingDeadlines.map((deadline, idx) => {
                                  const isOverdue = new Date(deadline.dueDate) < new Date();
                                  return (
                                      <tr key={deadline.id} className="hover:bg-[#1a1825] transition-colors bg-[#13111C]">
                                          <td className="p-3 text-[13px] text-[#F9FAFB] font-medium w-full">
                                              {deadline.name}
                                              <span className="block text-[11px] text-[#6B7280]">{deadline.teamName}</span>
                                          </td>
                                          <td className={`p-3 text-[12px] whitespace-nowrap text-right ${isOverdue ? 'text-red-500 font-bold' : 'text-[#6B7280]'}`}>
                                              {new Date(deadline.dueDate).toLocaleDateString()}
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>

          {/* SECTION 6: Project Portfolio */}
          <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-5 hover:border-purple-500/30 transition-colors">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h2 className="text-[14px] font-bold text-[#F9FAFB]">Project Portfolio</h2>
                      <p className="text-[12px] text-[#6B7280]">Your active projects</p>
                  </div>
                  <div className="p-2 bg-fuchsia-500/10 rounded-full">
                      <LayoutGrid size={18} className="text-fuchsia-400" />
                  </div>
              </div>
              {projects.length === 0 ? (
                  <div className="text-center text-[#6B7280] py-6 text-[13px] bg-[#08070F] rounded-[10px] border border-[#2D2B45]">No projects assigned.</div>
              ) : (
                  <div className="border border-[#2D2B45] rounded-[10px] overflow-hidden">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="bg-[#08070F] border-b border-[#2D2B45]">
                                  <th className="p-3 text-[11px] font-semibold text-[#6B7280] uppercase">Project</th>
                                  <th className="p-3 text-[11px] font-semibold text-[#6B7280] uppercase text-right">Status</th>
                                  <th className="p-3 text-[11px] font-semibold text-[#6B7280] uppercase text-right">Progress</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2D2B45]">
                              {projects.map((project, idx) => (
                                  <tr key={project.id} className="hover:bg-[#1a1825] transition-colors bg-[#13111C]">
                                      <td className="p-3 text-[13px] text-[#F9FAFB] font-medium">
                                          {project.name}
                                          <span className="block text-[11px] text-[#6B7280]">{project.teamName}</span>
                                      </td>
                                      {renderTableData(project.status, "text-[#6B7280] capitalize")}
                                      {renderTableData(`${project.progress}%`, "text-emerald-400 font-bold")}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>

          {/* SECTION 9: Recent Activity */}
          <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-5 hover:border-purple-500/30 transition-colors">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h2 className="text-[14px] font-bold text-[#F9FAFB]">Global Activity</h2>
                      <p className="text-[12px] text-[#6B7280]">Latest updates</p>
                  </div>
                  <div className="p-2 bg-orange-500/10 rounded-full">
                      <Clock size={18} className="text-orange-400" />
                  </div>
              </div>
              {recentActivity.length === 0 ? (
                  <div className="text-center text-[#6B7280] py-6 text-[13px] bg-[#08070F] rounded-[10px] border border-[#2D2B45]">No recent activity.</div>
              ) : (
                  <div className="relative border-l border-[#2D2B45] ml-3 space-y-6 mt-4">
                      {recentActivity.map((act, idx) => (
                          <div key={act.id} className="relative pl-6 group">
                              <span className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-[#2D2B45] group-hover:bg-purple-500 border-2 border-[#13111C] transition-colors" />
                              <div className="flex flex-col gap-1">
                                  <span className="text-[13px] text-[#F9FAFB]">{act.description}</span>
                                  <span className="text-[11px] text-[#6B7280]">
                                      {formatDistanceToNow(new Date(act.time), { addSuffix: true })}
                                  </span>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeamLeadDashboardPage;