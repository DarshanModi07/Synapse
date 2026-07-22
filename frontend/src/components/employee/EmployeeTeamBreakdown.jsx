import React from 'react';
import { Users } from 'lucide-react';

const EmployeeTeamBreakdown = ({ teams }) => {
    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-5 hover:border-purple-500/30 transition-colors">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-[14px] font-bold text-[#F9FAFB]">Team Breakdown</h2>
                    <p className="text-[12px] text-[#6B7280]">Your active assignments</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-full">
                    <Users size={18} className="text-blue-400" />
                </div>
            </div>

            {(!teams || teams.length === 0) ? (
                <div className="text-center py-6 text-[#6B7280] text-[13px] bg-[#08070F] rounded-[10px] border border-[#2D2B45]">
                    You have not been assigned to any teams.
                </div>
            ) : (
                <div className="border border-[#2D2B45] rounded-[10px] overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#08070F] border-b border-[#2D2B45]">
                                <th className="p-3 text-[11px] font-semibold text-[#6B7280] uppercase">Team</th>
                                <th className="p-3 text-[11px] font-semibold text-[#6B7280] uppercase text-center">Active</th>
                                <th className="p-3 text-[11px] font-semibold text-[#6B7280] uppercase w-[40%]">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2D2B45]">
                            {teams.slice(0, 5).map((team, idx) => (
                                <tr key={team.id} className="hover:bg-[#1a1825] transition-colors bg-[#13111C]">
                                    <td className="p-3 text-[13px] text-[#F9FAFB] font-medium">
                                        {team.name}
                                    </td>
                                    <td className="p-3 text-[13px] text-[#6B7280] whitespace-nowrap text-center">
                                        {team.activeWork}
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[12px] font-medium text-[#F9FAFB] min-w-[32px]">{team.completionRate}%</span>
                                            <div className="h-1.5 w-full bg-[#08070F] rounded-full overflow-hidden border border-[#2D2B45]">
                                                <div 
                                                    className="h-full bg-blue-500 rounded-full" 
                                                    style={{ width: `${team.completionRate}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployeeTeamBreakdown;
