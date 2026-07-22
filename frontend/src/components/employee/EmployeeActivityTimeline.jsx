import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';

const EmployeeActivityTimeline = ({ activity }) => {
    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-5 hover:border-purple-500/30 transition-colors">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-[14px] font-bold text-[#F9FAFB]">Activity Timeline</h2>
                    <p className="text-[12px] text-[#6B7280]">Recent updates on your tasks</p>
                </div>
                <div className="p-2 bg-orange-500/10 rounded-full">
                    <Clock size={18} className="text-orange-400" />
                </div>
            </div>
            
            {(!activity || activity.length === 0) ? (
                <div className="text-center py-6 text-[#6B7280] text-[13px] bg-[#08070F] rounded-[10px] border border-[#2D2B45]">
                    No recent activity.
                </div>
            ) : (
                <div className="relative border-l border-[#2D2B45] ml-3 space-y-6 mt-4">
                    {activity.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="relative pl-6 group">
                            <span className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-[#2D2B45] group-hover:bg-purple-500 border-2 border-[#13111C] transition-colors" />
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-start gap-4">
                                    <span className="text-[13px] font-medium text-[#F9FAFB]">{item.title}</span>
                                    <span className="text-[11px] text-[#6B7280] whitespace-nowrap">
                                        {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                                    </span>
                                </div>
                                <span className="text-[11px] text-[#6B7280] uppercase tracking-wider font-semibold">{item.type}</span>
                                {item.progress !== undefined && (
                                    <p className="text-[12px] text-emerald-400 font-medium mt-1">Progress updated to {item.progress}%</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployeeActivityTimeline;
