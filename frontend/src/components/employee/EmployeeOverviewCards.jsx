import React from 'react';
import { Users, CheckSquare, ListTodo, FileText, Activity, Clock, CalendarCheck, AlertOctagon } from 'lucide-react';

const EmployeeOverviewCards = ({ dashboardData }) => {
    if (!dashboardData?.overview) return null;

    const { overview } = dashboardData;

    const cards = [
        { label: 'Teams', value: overview.teamsCount || 0, icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10' },
        { label: 'Assigned Tasks', value: overview.tasksCount || 0, icon: CheckSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Assigned SubTasks', value: overview.subTasksCount || 0, icon: ListTodo, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Pending WorkItems', value: overview.pendingWorkItems || 0, icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Completed This Week', value: overview.completedThisWeek || 0, icon: CalendarCheck, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'Overdue Items', value: overview.overdueItems || 0, icon: AlertOctagon, color: 'text-red-500', bg: 'bg-red-500/10' },
        { label: 'Completion Rate', value: `${overview.completionRate || 0}%`, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { label: 'Upcoming Deadlines', value: overview.totalDeadlines || 0, icon: Clock, color: 'text-red-400', bg: 'bg-red-500/10' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col justify-between hover:border-[#4d4b65] transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-xl ${card.bg}`}>
                            <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <div className="text-2xl font-bold text-white">{card.value}</div>
                    </div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{card.label}</p>
                </div>
            ))}
        </div>
    );
};

export default EmployeeOverviewCards;
