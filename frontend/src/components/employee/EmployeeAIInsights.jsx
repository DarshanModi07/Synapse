import React from 'react';

const EmployeeAIInsights = ({ aiInsights }) => {
    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-[10px] p-4">
            <h2 className="text-[18px] font-semibold text-[#F9FAFB] mb-4">Personal AI Insights</h2>
            
            {(!aiInsights || (!aiInsights.insights?.length && !aiInsights.areasForImprovement?.length)) ? (
                <div className="text-center py-6 text-[#6B7280] text-[13px]">
                    Analytics will appear after you begin completing work.
                </div>
            ) : (
                <div className="space-y-4">
                    {aiInsights.insights?.length > 0 && (
                        <div className="space-y-3">
                            {aiInsights.insights.map((insight, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <span className="text-[#6B7280] text-[12px] mt-0.5">•</span>
                                    <p className="text-[13px] text-[#F9FAFB] leading-relaxed">{insight}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {aiInsights.areasForImprovement?.length > 0 && (
                        <div className="pt-4 border-t border-[#2D2B45]">
                            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-orange-400 mb-2">Areas for Improvement</h3>
                            <ul className="space-y-2">
                                {aiInsights.areasForImprovement.map((area, idx) => (
                                    <li key={idx} className="text-[13px] text-[#6B7280] flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-orange-400" /> {area}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmployeeAIInsights;
