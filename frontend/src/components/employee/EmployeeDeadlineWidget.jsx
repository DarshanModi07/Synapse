import React from 'react';
import { CalendarDays } from 'lucide-react';

const EmployeeDeadlineWidget = ({ deadlines }) => {
    const { overdue = [], today = [], tomorrow = [], thisWeek = [] } = deadlines || {};

    const renderTable = (items, label, titleColor) => {
        if (!items || items.length === 0) return null;
        
        return (
            <div className="mb-6 last:mb-0">
                <h3 className={`text-[12px] font-bold mb-2 ${titleColor}`}>{label}</h3>
                <div className="border border-[#2D2B45] rounded-[10px] overflow-hidden">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-[#2D2B45]">
                            {items.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-[#1a1825] transition-colors bg-[#13111C]">
                                    <td className="p-3 text-[13px] text-[#F9FAFB] font-medium w-full">
                                        {item.title}
                                    </td>
                                    <td className="p-3 text-[11px] text-[#6B7280] uppercase tracking-wider font-semibold whitespace-nowrap">
                                        {item.type}
                                    </td>
                                    <td className="p-3 text-[12px] text-[#F9FAFB] whitespace-nowrap text-right">
                                        {new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-5 hover:border-purple-500/30 transition-colors">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-[14px] font-bold text-[#F9FAFB]">Upcoming Deadlines</h2>
                    <p className="text-[12px] text-[#6B7280]">Your immediate tasks sorted by urgency</p>
                </div>
                <div className="p-2 bg-yellow-500/10 rounded-full">
                    <CalendarDays size={18} className="text-yellow-400" />
                </div>
            </div>

            {overdue.length === 0 && today.length === 0 && tomorrow.length === 0 && thisWeek.length === 0 ? (
                <div className="text-center py-6 text-[#6B7280] text-[13px] bg-[#08070F] rounded-[10px] border border-[#2D2B45]">
                    No upcoming deadlines.
                </div>
            ) : (
                <div>
                    {renderTable(overdue, 'Overdue', 'text-red-400')}
                    {renderTable(today, 'Today', 'text-orange-400')}
                    {renderTable(tomorrow, 'Tomorrow', 'text-yellow-400')}
                    {renderTable(thisWeek, 'This Week', 'text-emerald-400')}
                </div>
            )}
        </div>
    );
};

export default EmployeeDeadlineWidget;
