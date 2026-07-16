import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTeamLeadMemberDetails } from '../../hooks/useTeamLeadMemberDetails';
import TeamLeadMemberProfile from '../../components/teamLead/TeamLeadMemberProfile';
import TeamLeadMemberAnalytics from '../../components/teamLead/TeamLeadMemberAnalytics';

const TeamLeadMemberDetailsPage = () => {
    const { slug, memberId } = useParams();
    const { profile, stats, timeline, tasks, subtasks, workItems, analytics, loading, error } = useTeamLeadMemberDetails(memberId);

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-purple-500/30 border-t-purple-500" />
                    <span>Loading profile details...</span>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex h-[70vh] items-center justify-center text-red-400">
                {error || "Member not found."}
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto mt-4">
            
            {/* Navigation */}
            <Link 
                to={`/workspace/${slug}/team-lead/members`}
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Members List
            </Link>

            {/* Profile Header */}
            <TeamLeadMemberProfile profile={profile} stats={stats} />

            {/* Analytics & Timeline */}
            <TeamLeadMemberAnalytics timeline={timeline} analytics={analytics} stats={stats} />

            {/* Task Assignments Data (Subtasks specifically assigned to member) */}
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6 mt-8">
                <h3 className="text-white font-semibold text-base mb-6">Assigned Subtasks</h3>
                
                {subtasks.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-[#2D2B45] rounded-xl bg-[#08070F]">
                        <p className="text-gray-500 text-sm">No subtasks are currently assigned to this member.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-[#2D2B45] text-gray-500 font-semibold uppercase tracking-wider text-xs">
                                    <th className="pb-3 pr-4">Parent Task</th>
                                    <th className="pb-3 px-4">Subtask Title</th>
                                    <th className="pb-3 px-4">Status</th>
                                    <th className="pb-3 px-4">Due Date</th>
                                    <th className="pb-3 pl-4">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D2B45]">
                                {subtasks.map(st => (
                                    <tr key={st.id} className="hover:bg-[#1a1a24] transition-colors">
                                        <td className="py-4 pr-4 font-medium text-gray-300 max-w-[200px] truncate">{st.parentTask}</td>
                                        <td className="py-4 px-4 font-semibold text-white">{st.title}</td>
                                        <td className="py-4 px-4">
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#08070F] border border-[#2D2B45] text-gray-300">
                                                {st.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-400 text-xs">
                                            {st.dueDate ? new Date(st.dueDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="py-4 pl-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-[#08070F] rounded-full overflow-hidden border border-[#2D2B45] w-24">
                                                    <div 
                                                        className="h-full bg-purple-500 rounded-full"
                                                        style={{ width: `${st.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-400">{st.progress}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Work Items */}
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6 mt-6">
                <h3 className="text-white font-semibold text-base mb-6">Work Items</h3>
                
                {workItems.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-[#2D2B45] rounded-xl bg-[#08070F]">
                        <p className="text-gray-500 text-sm">No work items are currently logged by this member.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-[#2D2B45] text-gray-500 font-semibold uppercase tracking-wider text-xs">
                                    <th className="pb-3 pr-4">Work Item Title</th>
                                    <th className="pb-3 px-4">Status</th>
                                    <th className="pb-3 px-4 text-center">Estimated Hrs</th>
                                    <th className="pb-3 pl-4 text-center">Actual Hrs</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D2B45]">
                                {workItems.map(wi => (
                                    <tr key={wi.id} className="hover:bg-[#1a1a24] transition-colors">
                                        <td className="py-4 pr-4 font-semibold text-white">{wi.title}</td>
                                        <td className="py-4 px-4">
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#08070F] border border-[#2D2B45] text-gray-300">
                                                {wi.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center text-gray-400 font-medium">{wi.estimatedHours}h</td>
                                        <td className="py-4 pl-4 text-center text-gray-400 font-medium">{wi.actualHours}h</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
};

export default TeamLeadMemberDetailsPage;
