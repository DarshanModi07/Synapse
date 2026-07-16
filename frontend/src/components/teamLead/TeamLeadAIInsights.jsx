import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, TrendingDown, Target, Zap, Activity } from 'lucide-react';

const getHealthScoreDetails = (score) => {
    if (score >= 95) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 80) return { label: 'Healthy', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
    if (score >= 60) return { label: 'Needs Attention', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
};

const TeamLeadAIInsights = ({ insights }) => {
    if (!insights) return null;

    return (
        <div className="space-y-6 mt-8">
            
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">AI-Powered Insights</h2>
            </div>

            {/* Top Cards for Lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Overloaded Teams */}
                <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-5">
                    <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-400" /> Overloaded Teams
                    </h3>
                    <ul className="space-y-2">
                        {insights.overloadedTeams?.length > 0 ? (
                            insights.overloadedTeams.map((team, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> {team}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-500">None detected.</li>
                        )}
                    </ul>
                </div>

                {/* Underutilized Teams */}
                <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-5">
                    <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-blue-400" /> Underutilized Teams
                    </h3>
                    <ul className="space-y-2">
                        {insights.underutilizedTeams?.length > 0 ? (
                            insights.underutilizedTeams.map((team, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {team}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-500">None detected.</li>
                        )}
                    </ul>
                </div>

                {/* Top Performing Teams */}
                <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-5">
                    <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" /> Top Performing
                    </h3>
                    <ul className="space-y-2">
                        {insights.topPerformers?.length > 0 ? (
                            insights.topPerformers.map((team, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> {team}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-500">None detected.</li>
                        )}
                    </ul>
                </div>

            </div>

            {/* Risk & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-5">
                    <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4 text-red-400" /> Risk Analysis
                    </h3>
                    <ul className="space-y-3 border-l border-[#2D2B45] ml-2">
                        {insights.risks?.length > 0 ? (
                            insights.risks.map((risk, idx) => (
                                <li key={idx} className="text-sm text-gray-300 pl-4 relative">
                                    <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-500" />
                                    {risk}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-500 pl-4">No major risks identified.</li>
                        )}
                    </ul>
                </div>

                <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-5">
                    <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recommendations
                    </h3>
                    <ul className="space-y-3 border-l border-[#2D2B45] ml-2">
                        {insights.recommendations?.length > 0 ? (
                            insights.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-gray-300 pl-4 relative">
                                    <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    {rec}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-500 pl-4">No recommendations available.</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Team Health Score List */}
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                <h3 className="text-white font-semibold text-sm mb-6 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" /> Team Health Scores
                </h3>
                
                {insights.teamHealthScore && Object.keys(insights.teamHealthScore).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(insights.teamHealthScore).map(([team, score]) => {
                            const health = getHealthScoreDetails(score);
                            return (
                                <div key={team} className={`border rounded-xl p-4 flex flex-col justify-between gap-3 ${health.bg}`}>
                                    <span className="text-sm font-semibold text-white truncate">{team}</span>
                                    <div className="flex items-end justify-between">
                                        <span className={`text-2xl font-bold ${health.color}`}>{score}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${health.color}`}>{health.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No health scores available.</p>
                )}
            </div>

        </div>
    );
};

export default TeamLeadAIInsights;
