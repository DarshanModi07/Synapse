import React from 'react';
import { Users, FolderKanban, ListTodo, Activity, CheckCircle2, AlertCircle, Percent, Clock } from 'lucide-react';

const EmployeeOverviewCards = ({ dashboardData }) => {
    if (!dashboardData?.overview) return null;

    const { overview } = dashboardData;

    const cards = [
        { label: 'Teams', value: overview.teamsCount || 0, icon: <Users size={18} className="text-purple-400" /> },
        { label: 'Tasks', value: overview.tasksCount || 0, icon: <FolderKanban size={18} className="text-blue-400" /> },
        { label: 'SubTasks', value: overview.subTasksCount || 0, icon: <ListTodo size={18} className="text-indigo-400" /> },
        { label: 'Pending Work', value: overview.pendingWorkItems || 0, icon: <Activity size={18} className="text-orange-400" /> },
        { label: 'Done (Week)', value: overview.completedThisWeek || 0, icon: <CheckCircle2 size={18} className="text-emerald-400" /> },
        { label: 'Overdue', value: overview.overdueItems || 0, icon: <AlertCircle size={18} className="text-red-400" /> },
        { label: 'Progress', value: `${overview.completionRate || 0}%`, icon: <Percent size={18} className="text-fuchsia-400" /> },
        { label: 'Deadlines', value: overview.totalDeadlines || 0, icon: <Clock size={18} className="text-yellow-400" /> },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-4 flex flex-col justify-between hover:border-purple-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[13px] font-medium text-[#6B7280] group-hover:text-[#F9FAFB] transition-colors">{card.label}</h3>
                        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                            {card.icon}
                        </div>
                    </div>
                    <div className="text-[24px] font-bold text-[#F9FAFB]">{card.value}</div>
                </div>
            ))}
        </div>
    );
};

export default EmployeeOverviewCards;
