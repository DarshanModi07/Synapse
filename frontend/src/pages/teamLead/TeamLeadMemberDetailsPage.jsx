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
                <div className="flex flex-col items-center gap-4 text-[#6B7280]">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-purple-500/30 border-t-purple-500" />
                    <span className="text-[13px] font-medium">Loading profile details...</span>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex h-[70vh] items-center justify-center text-red-400 bg-red-500/10 p-6 rounded-[14px] shadow-sm border border-red-500/20 max-w-md mx-auto mt-20">
                <span className="font-medium text-[14px]">{error || "Member not found."}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 max-w-[1400px] mx-auto mt-4">
            
            {/* Navigation */}
            <Link 
                to={`/workspace/${slug}/team-lead/members`}
                className="inline-flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#F9FAFB] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Members List
            </Link>

            {/* Profile Header */}
            <TeamLeadMemberProfile profile={profile} stats={stats} />

            {/* Analytics & Timeline */}
            <TeamLeadMemberAnalytics timeline={timeline} analytics={analytics} stats={stats} />

            {/* Task Assignments Data (Subtasks specifically assigned to member) */}
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] p-6 mt-8 shadow-sm">
                <h3 className="text-[#F9FAFB] font-bold text-[14px] mb-5">Assigned Subtasks</h3>
                
                {subtasks.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-[#2D2B45] rounded-[10px] bg-[#08070F]/50">
                        <p className="text-[#6B7280] text-[13px]">No subtasks are currently assigned to this member.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-[10px] border border-[#2D2B45]">
                        <table className="w-full text-left text-[13px] border-collapse">
                            <thead>
                                <tr className="bg-[#08070F] border-b border-[#2D2B45] text-[#6B7280] font-bold uppercase tracking-wider text-[12px]">
                                    <th className="py-4 px-5">Parent Task</th>
                                    <th className="py-4 px-5">Subtask Title</th>
                                    <th className="py-4 px-5">Status</th>
                                    <th className="py-4 px-5">Due Date</th>
                                    <th className="py-4 px-5">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D2B45]">
                                {subtasks.map(st => (
                                    <tr key={st.id} className="hover:bg-[#1a1825] transition-colors bg-[#13111C] group">
                                        <td className="py-4 px-5 font-medium text-[#6B7280] max-w-[200px] truncate">{st.parentTask}</td>
                                        <td className="py-4 px-5 font-bold text-[#F9FAFB] group-hover:text-purple-400 transition-colors">{st.title}</td>
                                        <td className="py-4 px-5">
                                            <span className="px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wider bg-[#08070F] border border-[#2D2B45] text-[#6B7280]">
                                                {st.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-[#6B7280] text-[13px] font-medium">
                                            {st.dueDate ? new Date(st.dueDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-[#08070F] rounded-full overflow-hidden border border-[#2D2B45] w-24">
                                                    <div 
                                                        className="h-full bg-purple-500 rounded-full"
                                                        style={{ width: `${st.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-[12px] font-bold text-[#F9FAFB]">{st.progress}%</span>
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
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] p-6 mt-6 shadow-sm">
                <h3 className="text-[#F9FAFB] font-bold text-[14px] mb-5">Work Items</h3>
                
                {workItems.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-[#2D2B45] rounded-[10px] bg-[#08070F]/50">
                        <p className="text-[#6B7280] text-[13px]">No work items are currently logged by this member.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-[10px] border border-[#2D2B45]">
                        <table className="w-full text-left text-[13px] border-collapse">
                            <thead>
                                <tr className="bg-[#08070F] border-b border-[#2D2B45] text-[#6B7280] font-bold uppercase tracking-wider text-[12px]">
                                    <th className="py-4 px-5">Work Item Title</th>
                                    <th className="py-4 px-5">Status</th>
                                    <th className="py-4 px-5 text-center">Estimated Hrs</th>
                                    <th className="py-4 px-5 text-center">Actual Hrs</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D2B45]">
                                {workItems.map(wi => (
                                    <tr key={wi.id} className="hover:bg-[#1a1825] transition-colors bg-[#13111C] group">
                                        <td className="py-4 px-5 font-bold text-[#F9FAFB] group-hover:text-blue-400 transition-colors">{wi.title}</td>
                                        <td className="py-4 px-5">
                                            <span className="px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wider bg-[#08070F] border border-[#2D2B45] text-[#6B7280]">
                                                {wi.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-center text-[#6B7280] font-medium">{wi.estimatedHours}h</td>
                                        <td className="py-4 px-5 text-center text-blue-400 font-bold">{wi.actualHours}h</td>
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
