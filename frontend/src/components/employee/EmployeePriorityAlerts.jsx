import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EmployeePriorityAlerts = ({ priorityAlerts }) => {
    if (!priorityAlerts) return null;

    const { high = [], medium = [], low = [] } = priorityAlerts;

    if (high.length === 0 && medium.length === 0 && low.length === 0) {
        return (
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" /> Priority Alerts
                </h2>
                <div className="text-center py-6 border border-dashed border-[#2D2B45] rounded-xl">
                    <p className="text-gray-500 text-sm">No active alerts.</p>
                </div>
            </div>
        );
    }

    const renderAlertList = (items, label, colorClass, dotClass) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="mb-4 last:mb-0">
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${colorClass}`}>{label}</h3>
                <ul className="space-y-2">
                    {items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} /> {item.title}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" /> Priority Alerts
            </h2>
            
            <div className="space-y-2">
                {renderAlertList(high, 'HIGH PRIORITY', 'text-red-400', 'bg-red-400')}
                {renderAlertList(medium, 'MEDIUM', 'text-orange-400', 'bg-orange-400')}
                {renderAlertList(low, 'LOW', 'text-gray-400', 'bg-gray-400')}
            </div>
        </div>
    );
};

export default EmployeePriorityAlerts;
