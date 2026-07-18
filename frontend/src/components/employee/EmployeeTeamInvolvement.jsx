import React from 'react';
import { Users } from 'lucide-react';

const EmployeeTeamInvolvement = ({ teams }) => {
    if (!teams || teams.length === 0) {
        return (
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-400" /> Team Involvement
                </h2>
                <div className="text-center py-6 border border-dashed border-[#2D2B45] rounded-xl">
                    <p className="text-gray-500 text-sm">You have not been assigned to any teams.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-400" /> Team Involvement
            </h2>

            <div className="space-y-4">
                {teams.map(team => (
                    <div key={team.id} className="bg-[#08070F] border border-[#2D2B45] rounded-xl p-4 flex justify-between items-center hover:border-pink-500/30 transition-colors">
                        <h3 className="text-sm font-semibold text-white">{team.name}</h3>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Active Tasks</p>
                            <p className="text-sm font-bold text-white">{team.activeTasks || 0}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeTeamInvolvement;
