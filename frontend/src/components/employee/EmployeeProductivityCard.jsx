import React from 'react';
import { Target } from 'lucide-react';

const EmployeeProductivityCard = ({ productivity }) => {
    if (!productivity) return null;

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-400" /> Personal Productivity
            </h2>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#2D2B45]">
                    <span className="text-sm font-medium text-gray-400">Tasks Completed</span>
                    <span className="text-sm font-bold text-white">{productivity.tasksCompleted || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#2D2B45]">
                    <span className="text-sm font-medium text-gray-400">SubTasks Completed</span>
                    <span className="text-sm font-bold text-white">{productivity.subTasksCompleted || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#2D2B45]">
                    <span className="text-sm font-medium text-gray-400">WorkItems Completed</span>
                    <span className="text-sm font-bold text-white">{productivity.workItemsCompleted || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#2D2B45]">
                    <span className="text-sm font-medium text-gray-400">Weekly Productivity</span>
                    <span className="text-sm font-bold text-emerald-400">{productivity.weeklyProductivity || 0}%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-400">Average Completion Time</span>
                    <span className="text-sm font-bold text-white">{productivity.averageCompletionTime || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProductivityCard;
