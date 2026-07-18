import React from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const EmployeeActivityTimeline = ({ activity }) => {
    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <ActivityIcon className="w-5 h-5 text-purple-400" /> Recent Activity
            </h2>
            
            {(!activity || activity.length === 0) ? (
                <div className="text-center py-8 border border-dashed border-[#2D2B45] rounded-xl">
                    <p className="text-gray-500 text-sm">No recent activity.</p>
                </div>
            ) : (
                <div className="space-y-6 border-l border-[#2D2B45] ml-2">
                    {activity.map((item, idx) => (
                        <div key={idx} className="relative pl-5">
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-[#13111C]" />
                            <p className="text-sm font-semibold text-white">{item.type}</p>
                            <p className="text-xs text-gray-400 mt-1">{item.title}</p>
                            {item.progress !== undefined && (
                                <p className="text-xs text-emerald-400 font-medium mt-1">Progress updated to {item.progress}%</p>
                            )}
                            <p className="text-[10px] text-gray-500 mt-1.5 uppercase font-medium tracking-wide">
                                {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployeeActivityTimeline;
