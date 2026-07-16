import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye } from 'lucide-react';

const TeamLeadMembersTable = ({ members }) => {
    const navigate = useNavigate();
    const { slug } = useParams();

    if (!members || members.length === 0) {
        return (
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <p className="text-gray-400 font-medium mb-1">No Members Found</p>
                <p className="text-gray-500 text-sm">Members assigned to teams under your leadership will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#08070F] border-b border-[#2D2B45] text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Department & Team</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4 text-center">Tasks</th>
                        <th className="px-6 py-4 text-center">Progress</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2B45]">
                    {members.map(member => (
                        <tr key={member.id} className="hover:bg-[#1a1a24] transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#2D2B45] flex items-center justify-center overflow-hidden shrink-0">
                                        {member.avatar ? (
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400 font-medium text-sm">
                                                {member.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{member.name}</p>
                                        {!member.isActive && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Inactive</span>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-400">{member.email}</p>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-300">
                                        {member.departments.length > 1 ? `${member.departments[0]} +${member.departments.length - 1}` : member.departments[0]}
                                    </span>
                                    <span className="text-[11px] text-gray-500 truncate max-w-[200px]">
                                        {member.teams.length > 1 ? `${member.teams[0]} +${member.teams.length - 1}` : member.teams[0]}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                    member.role === 'team_lead' 
                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {member.role === 'team_lead' ? 'Team Lead' : 'Employee'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <span className="text-sm text-white font-medium">{member.completedTasks} <span className="text-gray-500">/ {member.assignedTasks}</span></span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Completed</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-[#08070F] rounded-full overflow-hidden border border-[#2D2B45]">
                                        <div 
                                            className="h-full bg-[#7C3AED] rounded-full"
                                            style={{ width: `${member.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-gray-400 w-8">{member.progress}%</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button 
                                    onClick={() => navigate(`/workspace/${slug}/team-lead/members/${member.id}`)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#2D2B45] transition-colors border border-transparent hover:border-[#3a3854]"
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
