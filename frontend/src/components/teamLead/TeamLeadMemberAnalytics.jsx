import React from 'react';
import { Activity, Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

const TeamLeadMemberAnalytics = ({ timeline, analytics, stats }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Analytics Column */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] p-6 shadow-sm">
                    <h3 className="text-[#F9FAFB] font-bold text-[14px] mb-5 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        Performance Analytics
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="bg-[#08070F] border border-[#2D2B45] rounded-[10px] p-4 hover:border-purple-500/30 transition-colors">
                            <span className="text-[11px] text-[#6B7280] block mb-1 uppercase tracking-wider font-bold">Highest Productivity</span>
                            <span className="text-[13px] font-bold text-[#F9FAFB]">{analytics?.highestProductivity || "Evaluating..."}</span>
                        </div>
                        
                        <div className="bg-[#08070F] border border-[#2D2B45] rounded-[10px] p-4 hover:border-orange-500/30 transition-colors">
                            <span className="text-[11px] text-[#6B7280] block mb-1 uppercase tracking-wider font-bold">Most Delayed</span>
                            <span className="text-[13px] font-bold text-[#F9FAFB] flex items-center gap-1.5">
                                {analytics?.mostDelayed === "N/A" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
                                {analytics?.mostDelayed || "None"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Column */}
            <div className="lg:col-span-2">
                <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] p-6 h-full min-h-[400px] shadow-sm">
                    <h3 className="text-[#F9FAFB] font-bold text-[14px] mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        Activity Timeline
                    </h3>

                    {!timeline || timeline.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-[#6B7280] text-[13px]">No recent activity recorded for this member.</p>
                        </div>
                    ) : (
                        <div className="relative border-l border-[#2D2B45] ml-3 space-y-6">
                            {timeline.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="relative pl-6 group">
                                    {/* Timeline Dot */}
                                    <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#13111C] transition-colors ${
                                        item.action.includes('Completed') ? 'bg-emerald-500 group-hover:bg-emerald-400' : 'bg-blue-500 group-hover:bg-blue-400'
                                    }`} />
                                    
                                    <div className="bg-[#08070F] border border-[#2D2B45] rounded-[10px] p-4 group-hover:border-[#6B7280]/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[13px] font-bold text-[#F9FAFB]">{item.action}</span>
                                            <span className="text-[11px] text-[#6B7280] font-medium flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {' '}•{' '}
                                                {new Date(item.time).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-[13px] text-[#6B7280]">{item.description}</p>
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
