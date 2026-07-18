import React from 'react';
import { Activity as ActivityIcon } from 'lucide-react';

const EmployeeActivityFeed = ({ activity }) => {
    if (!activity || activity.length === 0) {
        return (
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <ActivityIcon className="w-5 h-5 text-blue-400" /> Recent Activity
                </h2>
                <div className="text-center py-8 border border-dashed border-[#2D2B45] rounded-xl">
                    <p className="text-gray-500 text-sm">No recent activity.</p>
                </div>
            </div>
        );
    }

    const todayItems = [];
    const yesterdayItems = [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    activity.forEach(item => {
        const itemDate = new Date(item.time);
        if (itemDate >= today) {
            todayItems.push(item);
        } else if (itemDate >= yesterday) {
            yesterdayItems.push(item);
        }
    });

    const renderActivityList = (items, label) => {
        if (items.length === 0) return null;
        return (
            <div className="mb-6 last:mb-0">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-4">{label}</h3>
                <div className="space-y-5 border-l border-[#2D2B45] ml-2">
                    {items.map((item) => (
                        <div key={item.id} className="relative pl-5">
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#13111C]" />
                            <p className="text-xs font-semibold text-gray-400">
                                {item.type.includes('Updated') ? 'Updated:' : 'Completed:'}
                            </p>
                            <p className="text-sm text-white mt-0.5">{item.title}</p>
                            {item.progress && (
                                <p className="text-xs text-blue-400 font-medium mt-1">Progress → {item.progress}%</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <ActivityIcon className="w-5 h-5 text-blue-400" /> Recent Activity
            </h2>
            
            <div className="mt-4">
                {renderActivityList(todayItems, 'Today')}
                {renderActivityList(yesterdayItems, 'Yesterday')}
                
                {todayItems.length === 0 && yesterdayItems.length === 0 && (
                    <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">Activity older than 2 days is hidden.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeActivityFeed;
