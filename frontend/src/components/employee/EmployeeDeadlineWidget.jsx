import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const EmployeeDeadlineWidget = ({ deadlines }) => {
    const { overdue = [], today = [], tomorrow = [], thisWeek = [] } = deadlines || {};

    const renderList = (items, colorClass, borderClass, label) => {
        if (!items || items.length === 0) return null;
        
        return (
            <div className="mb-6 last:mb-0">
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${colorClass}`}>{label}</h3>
                <div className="space-y-3">
                    {items.map(item => (
                        <div key={item.id} className={`bg-[#08070F] border-l-4 ${borderClass} rounded-r-xl p-3 flex justify-between items-center`}>
                            <div>
                                <p className="text-sm font-semibold text-white">{item.title}</p>
                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide mt-1">{item.type}</p>
                            </div>
                            <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-4">
                                {new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-400" /> Upcoming Deadlines
            </h2>

            {overdue.length === 0 && today.length === 0 && tomorrow.length === 0 && thisWeek.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-[#2D2B45] rounded-xl flex flex-col items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-gray-600 mb-2" />
                    <p className="text-gray-500 text-sm">No upcoming deadlines.</p>
                </div>
            ) : (
                <div>
                    {renderList(overdue, 'text-red-500', 'border-red-500', 'Overdue')}
                    {renderList(today, 'text-orange-400', 'border-orange-500', 'Today (< 24 Hours)')}
                    {renderList(tomorrow, 'text-yellow-400', 'border-yellow-500', 'Tomorrow (< 3 Days)')}
                    {renderList(thisWeek, 'text-emerald-400', 'border-emerald-500', 'This Week (> 3 Days)')}
                </div>
            )}
        </div>
    );
};

export default EmployeeDeadlineWidget;
