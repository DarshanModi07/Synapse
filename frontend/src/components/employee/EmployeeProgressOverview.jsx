import React from 'react';
import { BarChart } from 'lucide-react';

const EmployeeProgressOverview = ({ progressOverview }) => {
    if (!progressOverview) return null;

    const { tasks = 0, subTasks = 0, workItems = 0, overall = 0 } = progressOverview;

    const renderProgressBar = (label, value, colorClass, bgClass) => (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-gray-300">{label}</span>
                <span className={`text-xs font-bold ${colorClass}`}>{value}%</span>
            </div>
            <div className="h-2 w-full bg-[#08070F] rounded-full overflow-hidden border border-[#2D2B45]">
                <div className={`h-full ${bgClass} rounded-full`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-emerald-400" /> Progress Overview
            </h2>
            
            <div className="space-y-2">
                {renderProgressBar('Overall Progress', overall, 'text-emerald-400', 'bg-emerald-500')}
                {renderProgressBar('Tasks Progress', tasks, 'text-purple-400', 'bg-purple-500')}
                {renderProgressBar('SubTasks Progress', subTasks, 'text-blue-400', 'bg-blue-500')}
                {renderProgressBar('WorkItems Progress', workItems, 'text-orange-400', 'bg-orange-500')}
            </div>
        </div>
    );
};

export default EmployeeProgressOverview;
