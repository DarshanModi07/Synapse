import React from 'react';
import { Zap, BrainCircuit, Target } from 'lucide-react';

const EmployeeAIInsights = ({ aiInsights }) => {
    return (
        <div className="bg-gradient-to-br from-[#13111C] to-[#1a1829] border border-[#2D2B45] rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <BrainCircuit className="w-24 h-24 text-purple-400" />
            </div>
            
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
                <Zap className="w-5 h-5 text-purple-400" /> Personal AI Insights
            </h2>
            
            {(!aiInsights || (!aiInsights.insights?.length && !aiInsights.areasForImprovement?.length)) ? (
                <div className="text-center py-6 relative z-10">
                    <p className="text-gray-500 text-sm">Analytics will appear after you begin completing work.</p>
                </div>
            ) : (
                <div className="space-y-6 relative z-10">
                    {aiInsights.insights?.length > 0 && (
                        <div className="space-y-4">
                            {aiInsights.insights.map((insight, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <Target className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-300 leading-relaxed">{insight}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {aiInsights.areasForImprovement?.length > 0 && (
                        <div className="pt-5 border-t border-[#2D2B45]">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-3">Areas for Improvement</h3>
                            <ul className="space-y-2">
                                {aiInsights.areasForImprovement.map((area, idx) => (
                                    <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> {area}
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
