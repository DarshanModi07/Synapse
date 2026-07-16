import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = {
    Todo: '#6b7280',        // gray-500
    'In Progress': '#3b82f6', // blue-500
    'In Review': '#eab308',   // yellow-500
    Done: '#10b981'         // emerald-500
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1a1a24] border border-[#2D2B45] p-3 rounded-lg shadow-xl">
                <p className="text-white font-medium text-sm mb-1">{label || payload[0].name}</p>
                <p className="text-gray-400 text-xs">
                    Count: <span className="text-white font-bold">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

const TeamLeadAnalyticsCharts = ({ charts }) => {
    if (!charts) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            
            {/* Task Status */}
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                <h3 className="text-white font-semibold text-sm mb-6">Task Status Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={charts.taskStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {charts.taskStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8b5cf6'} />
                                ))}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* SubTask Status */}
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                <h3 className="text-white font-semibold text-sm mb-6">SubTask Status Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={charts.subTaskStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {charts.subTaskStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8b5cf6'} />
                                ))}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* WorkItem Status */}
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                <h3 className="text-white font-semibold text-sm mb-6">Work Item Status Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={charts.workItemStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {charts.workItemStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8b5cf6'} />
                                ))}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Team Productivity Bar Chart */}
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                <h3 className="text-white font-semibold text-sm mb-6">Team Productivity (%)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.teamProductivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2D2B45" vertical={false} />
                            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#1a1a24' }} />
                            <Bar dataKey="productivity" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default TeamLeadAnalyticsCharts;
