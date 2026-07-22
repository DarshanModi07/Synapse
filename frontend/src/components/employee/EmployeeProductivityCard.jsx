import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity } from 'lucide-react';

const EmployeeProductivityCard = ({ productivity }) => {
    if (!productivity) return null;

    const data = [
        { name: 'Tasks', completed: productivity.tasksCompleted || 0, color: '#7C3AED' },
        { name: 'SubTasks', completed: productivity.subTasksCompleted || 0, color: '#A78BFA' },
        { name: 'WorkItems', completed: productivity.workItemsCompleted || 0, color: '#38BDF8' }
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#13111C] border border-[#2D2B45] p-3 rounded-[10px] shadow-lg">
                    <p className="text-[13px] font-medium text-[#F9FAFB]">{payload[0].payload.name}</p>
                    <p className="text-[14px] font-bold text-purple-400">{payload[0].value} Completed</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-5 hover:border-purple-500/30 transition-colors">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-[14px] font-bold text-[#F9FAFB]">Personal Productivity</h2>
                    <p className="text-[12px] text-[#6B7280]">Your completion metrics across all items</p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-full">
                    <Activity size={18} className="text-purple-400" />
                </div>
            </div>
            
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                        <Tooltip cursor={{ fill: '#ffffff0a' }} content={<CustomTooltip />} />
                        <Bar dataKey="completed" radius={[4, 4, 0, 0]} maxBarSize={50}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#2D2B45]">
                <div>
                    <span className="text-[12px] font-medium text-[#6B7280] block mb-1">Weekly Productivity</span>
                    <span className="text-[20px] font-bold text-emerald-400">{productivity.weeklyProductivity || 0}%</span>
                </div>
                <div>
                    <span className="text-[12px] font-medium text-[#6B7280] block mb-1">Avg Completion Time</span>
                    <span className="text-[14px] font-semibold text-[#F9FAFB]">{productivity.averageCompletionTime || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProductivityCard;
