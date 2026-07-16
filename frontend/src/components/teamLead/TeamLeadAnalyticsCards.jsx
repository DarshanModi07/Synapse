import React from 'react';
import { Users, LayoutGrid, Briefcase, ListTodo, CheckCircle2, TrendingUp } from 'lucide-react';

const TeamLeadAnalyticsCards = ({ overview }) => {
    if (!overview) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="text-gray-500 mb-1 group-hover:text-blue-400 transition-colors"><LayoutGrid size={20} /></div>
                <p className="text-sm font-medium text-gray-400">Total Teams</p>
                <p className="text-3xl font-bold text-white">{overview.totalTeams}</p>
            </div>

            <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="text-gray-500 mb-1 group-hover:text-purple-400 transition-colors"><Users size={20} /></div>
                <p className="text-sm font-medium text-gray-400">Total Members</p>
                <p className="text-3xl font-bold text-white">{overview.totalMembers}</p>
            </div>

            <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="text-gray-500 mb-1 group-hover:text-amber-400 transition-colors"><Briefcase size={20} /></div>
                <p className="text-sm font-medium text-gray-400">Active Projects</p>
                <p className="text-3xl font-bold text-white">{overview.activeProjects}</p>
            </div>

            <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="text-gray-500 mb-1 group-hover:text-pink-400 transition-colors"><ListTodo size={20} /></div>
                <p className="text-sm font-medium text-gray-400">Total Tasks</p>
                <p className="text-3xl font-bold text-white">{overview.totalTasks}</p>
            </div>

            <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="text-gray-500 mb-1 group-hover:text-emerald-400 transition-colors"><CheckCircle2 size={20} /></div>
                <p className="text-sm font-medium text-gray-400">Completed Tasks</p>
                <p className="text-3xl font-bold text-white">{overview.completedTasks}</p>
            </div>

            <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="text-gray-500 mb-1 group-hover:text-indigo-400 transition-colors"><TrendingUp size={20} /></div>
                <p className="text-sm font-medium text-gray-400">Average Progress</p>
                <p className="text-3xl font-bold text-white">{overview.averageTeamProgress}%</p>
            </div>
        </div>
    );
};

export default TeamLeadAnalyticsCards;
