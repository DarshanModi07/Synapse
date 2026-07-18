import React from 'react';
import { Target } from 'lucide-react';

const EmployeeProductivity = ({ productivity }) => {
    if (!productivity) return null;

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" /> Personal Productivity
            </h2>

            <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#2D2B45]">
                    <span className="text-sm text-gray-400 font-medium">Tasks Completed</span>
                    <span className="text-base font-bold text-white">{productivity.tasksCompleted}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#2D2B45]">
                    <span className="text-sm text-gray-400 font-medium">SubTasks Completed</span>
                    <span className="text-base font-bold text-white">{productivity.subTasksCompleted}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#2D2B45]">
                    <span className="text-sm text-gray-400 font-medium">WorkItems Completed</span>
                    <span className="text-base font-bold text-white">{productivity.workItemsCompleted}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#2D2B45]">
                    <span className="text-sm text-gray-400 font-medium">Hours Logged</span>
                    <span className="text-base font-bold text-white">{productivity.hoursLogged}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-400 font-medium">Weekly Productivity</span>
                    <span className="text-base font-bold text-emerald-400">{productivity.weeklyProductivity}%</span>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProductivity;
