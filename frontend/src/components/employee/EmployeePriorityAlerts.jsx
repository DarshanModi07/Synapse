import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EmployeePriorityAlerts = ({ priorityAlerts }) => {
    if (!priorityAlerts) return null;

    const { high = [], medium = [], low = [] } = priorityAlerts;

    if (high.length === 0 && medium.length === 0 && low.length === 0) {
        return (
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-5 hover:border-purple-500/30 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-[14px] font-bold text-[#F9FAFB]">Priority Alerts</h2>
                        <p className="text-[12px] text-[#6B7280]">Important notifications</p>
                    </div>
                    <div className="p-2 bg-red-500/10 rounded-full">
                        <AlertTriangle size={18} className="text-red-400" />
                    </div>
                </div>
                <div className="text-center py-6 text-[#6B7280] text-[13px] bg-[#08070F] rounded-[10px] border border-[#2D2B45]">
                    No active alerts.
                </div>
            </div>
        );
    }

    const renderTable = (items, label, titleColor) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="mb-6 last:mb-0">
                <h3 className={`text-[12px] font-bold mb-2 ${titleColor}`}>{label}</h3>
                <div className="border border-[#2D2B45] rounded-[10px] overflow-hidden">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-[#2D2B45]">
                            {items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-[#1a1825] transition-colors bg-[#13111C]">
                                    <td className="p-3 text-[13px] text-[#F9FAFB] font-medium w-full">
                                        {item.title}
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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-[14px] font-bold text-[#F9FAFB]">Priority Alerts</h2>
                    <p className="text-[12px] text-[#6B7280]">Important notifications</p>
                </div>
                <div className="p-2 bg-red-500/10 rounded-full">
                    <AlertTriangle size={18} className="text-red-400" />
                </div>
            </div>
            
            <div>
                {renderTable(high, 'HIGH PRIORITY', 'text-red-400')}
                {renderTable(medium, 'MEDIUM', 'text-orange-400')}
                {renderTable(low, 'LOW', 'text-[#6B7280]')}
            </div>
        </div>
    );
};

export default EmployeePriorityAlerts;
