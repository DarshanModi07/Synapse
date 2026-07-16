import React from 'react';
import { ShieldAlert, Users, LayoutList, CheckCircle2, AlertTriangle, Calendar, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamLeadAnalytics } from '../../hooks/useTeamLeadAnalytics';
import TeamLeadAnalyticsCards from '../../components/teamLead/TeamLeadAnalyticsCards';
import TeamLeadAnalyticsCharts from '../../components/teamLead/TeamLeadAnalyticsCharts';
import TeamLeadAIInsights from '../../components/teamLead/TeamLeadAIInsights';
import TeamLeadPredictions from '../../components/teamLead/TeamLeadPredictions';
import TeamLeadAnalyticsLoading from '../../components/teamLead/TeamLeadAnalyticsLoading';

const TeamLeadAnalyticsPage = () => {
    const { analyticsData, loading, error } = useTeamLeadAnalytics();

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <TeamLeadAnalyticsLoading key="loading" />
            ) : error ? (
                <motion.div 
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-[70vh] items-center justify-center text-red-400"
                >
                    {error}
                </motion.div>
            ) : (!analyticsData || !analyticsData.overview || analyticsData.overview.totalTeams === 0) ? (
                <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-[70vh] items-center justify-center text-center max-w-md mx-auto"
                >
                    <ShieldAlert className="w-12 h-12 text-gray-500 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Analytics Available</h2>
                    <p className="text-gray-400 text-sm">Analytics will appear once teams and tasks are assigned under your leadership.</p>
                </motion.div>
            ) : (
                <motion.div 
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8 pb-20 max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8"
                >
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Team Analytics</h1>
                        <p className="text-gray-400 mt-1 max-w-2xl">
                            AI-powered insights across all teams under your leadership.
                        </p>
                    </div>

                    {/* Top Cards */}
                    <TeamLeadAnalyticsCards overview={analyticsData.overview} />

                    {/* AI Insights (Includes Health Scores) */}
                    <TeamLeadAIInsights insights={analyticsData.aiInsights} />

                    {/* AI Predictions */}
                    <TeamLeadPredictions predictions={analyticsData.aiInsights?.predictions} />

                    {/* Charts Section */}
                    <TeamLeadAnalyticsCharts charts={analyticsData.charts} />

                    {/* Comparison / Data Tables Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                        
                        {/* Team Performance Table (Col span 2) */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl overflow-hidden">
                                <div className="px-6 py-5 border-b border-[#2D2B45] flex items-center justify-between">
                                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                                        <LayoutList className="w-4 h-4 text-purple-400" /> Team Performance
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-[#08070F] text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                                                <th className="px-6 py-3">Team Name</th>
                                                <th className="px-6 py-3 text-center">Members</th>
                                                <th className="px-6 py-3 text-center">Projects</th>
                                                <th className="px-6 py-3 text-center">Tasks</th>
                                                <th className="px-6 py-3 text-center">Completion %</th>
                                                <th className="px-6 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#2D2B45]">
                                            {analyticsData.teamPerformance.map(team => (
                                                <tr key={team.id} className="hover:bg-[#1a1a24] transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-white">{team.name}</td>
                                                    <td className="px-6 py-4 text-center text-gray-400">{team.members}</td>
                                                    <td className="px-6 py-4 text-center text-gray-400">{team.projects}</td>
                                                    <td className="px-6 py-4 text-center text-gray-400">{team.tasks}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="text-gray-300 font-medium">{team.completionPercent}%</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                            team.status === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            team.status === 'Warning' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        }`}>
                                                            {team.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Upcoming Deadlines */}
                            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-400" /> Upcoming Deadlines
                                </h3>
                                {analyticsData.upcomingDeadlines?.length > 0 ? (
                                    <div className="space-y-3">
                                        {analyticsData.upcomingDeadlines.map(t => (
                                            <div key={t.id} className="bg-[#08070F] border border-[#2D2B45] rounded-lg p-3 flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-white">{t.title}</p>
                                                    <p className="text-xs text-gray-500">{t.team}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-semibold text-gray-300">{new Date(t.dueDate).toLocaleDateString()}</p>
                                                    <p className={`text-[10px] uppercase font-bold tracking-wider ${t.priority === 'high' || t.priority === 'urgent' ? 'text-red-400' : 'text-gray-500'}`}>{t.priority}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No upcoming deadlines.</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-1 space-y-6">
                            
                            {/* Top Performers */}
                            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-emerald-400" /> Top Performers
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-[#2D2B45] pb-3">
                                        <span className="text-sm text-gray-400">Top Member</span>
                                        <span className="text-sm font-bold text-white">{analyticsData.topPerformers?.topMember}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#2D2B45] pb-3">
                                        <span className="text-sm text-gray-400">Top Team</span>
                                        <span className="text-sm font-bold text-white">{analyticsData.topPerformers?.topTeam}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-400">Highest Completion</span>
                                        <span className="text-sm font-bold text-emerald-400">{analyticsData.topPerformers?.highestCompletion}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-purple-400" /> Recent Activity
                                </h3>
                                {analyticsData.recentActivity?.length > 0 ? (
                                    <div className="relative border-l border-[#2D2B45] ml-2 space-y-5">
                                        {analyticsData.recentActivity.map((activity, idx) => (
                                            <div key={idx} className="relative pl-4">
                                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#13111C]" />
                                                <p className="text-sm font-semibold text-white">{activity.action}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{activity.description}</p>
                                                <p className="text-[10px] text-gray-500 mt-1">{new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No recent activity.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TeamLeadAnalyticsPage;
