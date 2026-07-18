import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye } from 'lucide-react';

const TeamLeadMembersTable = ({ members }) => {
    const navigate = useNavigate();
    const { slug } = useParams();

    if (!members || members.length === 0) {
        return (
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] p-12 flex flex-col items-center justify-center text-center shadow-sm">
                <p className="text-[#F9FAFB] font-medium mb-1 text-[13px]">No Members Found</p>
                <p className="text-[#6B7280] text-[12px]">Members assigned to teams under your leadership will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] overflow-hidden overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#08070F] border-b border-[#2D2B45] text-[12px] uppercase tracking-wider text-[#6B7280] font-bold">
                        <th className="px-5 py-4">Name</th>
                        <th className="px-5 py-4">Contact</th>
                        <th className="px-5 py-4">Department & Team</th>
                        <th className="px-5 py-4">Role</th>
                        <th className="px-5 py-4 text-center">Tasks</th>
                        <th className="px-5 py-4 text-center">Progress</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2B45]">
                    {members.map((member, idx) => (
                        <tr key={member.id} className="hover:bg-[#1a1825] transition-colors bg-[#13111C] group">
                            <td className="px-5 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-[8px] bg-[#2D2B45] flex items-center justify-center overflow-hidden shrink-0 border border-[#2D2B45]">
                                        {member.avatar ? (
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[#6B7280] font-medium text-[14px] group-hover:text-purple-400 transition-colors">
                                                {member.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-[#F9FAFB] group-hover:text-purple-400 transition-colors">{member.name}</p>
                                        {!member.isActive && (
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">Inactive</span>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                                <p className="text-[13px] font-medium text-[#6B7280]">{member.email}</p>
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[13px] font-bold text-[#F9FAFB]">
                                        {member.departments.length > 1 ? `${member.departments[0]} +${member.departments.length - 1}` : member.departments[0]}
                                    </span>
                                    <span className="text-[11px] font-medium text-[#6B7280] truncate max-w-[200px]">
                                        {member.teams.length > 1 ? `${member.teams[0]} +${member.teams.length - 1}` : member.teams[0]}
                                    </span>
                                </div>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                                <span className="capitalize text-[13px] font-medium text-[#6B7280]">
                                    {member.role === 'team_lead' ? 'Team Lead' : 'Employee'}
                                </span>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-center">
                                <span className="text-[13px] text-[#F9FAFB] font-bold">{member.completedTasks} <span className="text-[#6B7280] font-medium">/ {member.assignedTasks}</span></span>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-center">
                                <span className="text-[13px] font-bold text-emerald-400">{member.progress}%</span>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-right">
                                <button 
                                    onClick={() => navigate(`/workspace/${slug}/team-lead/members/${member.id}`)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium text-[#6B7280] hover:text-[#F9FAFB] hover:bg-[#1a1825] hover:border-purple-500/50 transition-colors border border-[#2D2B45]"
                                >
                                    <Eye className="w-3.5 h-3.5" /> View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeamLeadMembersTable;
