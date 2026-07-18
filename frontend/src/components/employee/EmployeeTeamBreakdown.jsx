import React from 'react';
import { Network } from 'lucide-react';

const EmployeeTeamBreakdown = ({ teams }) => {
    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-400" /> Team Breakdown
            </h2>

            {(!teams || teams.length === 0) ? (
                <div className="text-center py-8 border border-dashed border-[#2D2B45] rounded-xl">
                    <p className="text-gray-500 text-sm">You have not been assigned to any teams.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {teams.map(team => (
                        <div key={team.id} className="bg-[#08070F] border border-[#2D2B45] rounded-xl p-4 hover:border-purple-500/30 transition-colors">
                            <h3 className="font-semibold text-white mb-3">{team.name}</h3>
                            <div className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Active Work</p>
                                    <p className="text-white font-medium">{team.activeWork}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Completion Rate</p>
                                    <p className="text-emerald-400 font-medium">{team.completionRate}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployeeTeamBreakdown;
