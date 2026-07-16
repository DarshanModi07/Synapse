import React from 'react';
import { Activity, Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

const TeamLeadMemberAnalytics = ({ timeline, analytics, stats }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Analytics Column */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                    <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        Performance Analytics
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="bg-[#08070F] border border-[#2D2B45] rounded-lg p-3">
                            <span className="text-xs text-gray-500 block mb-1 uppercase tracking-wider font-bold">Highest Productivity</span>
                            <span className="text-sm font-medium text-white">{analytics?.highestProductivity || "Evaluating..."}</span>
                        </div>
                        
                        <div className="bg-[#08070F] border border-[#2D2B45] rounded-lg p-3">
                            <span className="text-xs text-gray-500 block mb-1 uppercase tracking-wider font-bold">Most Delayed</span>
                            <span className="text-sm font-medium text-white flex items-center gap-1">
                                {analytics?.mostDelayed === "N/A" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
                                {analytics?.mostDelayed || "None"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Column */}
            <div className="lg:col-span-2">
                <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6 h-full min-h-[400px]">
                    <h3 className="text-white font-semibold text-sm mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        Activity Timeline
                    </h3>

                    {!timeline || timeline.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-sm">No recent activity recorded for this member.</p>
                        </div>
                    ) : (
                        <div className="relative border-l border-[#2D2B45] ml-3 space-y-6">
                            {timeline.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="relative pl-6">
                                    {/* Timeline Dot */}
                                    <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#13111C] ${
                                        item.action.includes('Completed') ? 'bg-emerald-500' : 'bg-blue-500'
                                    }`} />
                                    
                                    <div className="bg-[#08070F] border border-[#2D2B45] rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-semibold text-white">{item.action}</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {' '}•{' '}
                                                {new Date(item.time).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default TeamLeadMemberAnalytics;
