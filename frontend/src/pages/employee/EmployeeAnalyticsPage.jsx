import React, { useState, useEffect } from 'react';
import { Activity, CheckSquare, ListTodo, FileText, Clock, Loader2, Zap, BrainCircuit, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useEmployeeAnalytics } from '../../hooks/useEmployeeAnalytics';

const EmployeeAnalyticsPage = () => {
    const { analyticsData, loading, error } = useEmployeeAnalytics();

    // AI Insight Animation State
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const aiAnalysisSteps = [
        "Analyzing Productivity",
        "Evaluating Delays",
        "Calculating Completion Times",
        "Finding Work Patterns"
    ];

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setCurrentStepIndex((prev) => (prev < aiAnalysisSteps.length - 1 ? prev + 1 : prev));
            }, 800);
            return () => clearInterval(interval);
        }
    }, [loading]);

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8 pb-12"
                >
                    <div className="h-10 w-64 bg-[#13111C] rounded animate-pulse" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-[#13111C] rounded-2xl p-5 h-24 animate-pulse" />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                                <h3 className="text-white font-semibold">Generating AI Insights</h3>
                                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                            </div>
                            <div className="space-y-4">
                                {aiAnalysisSteps.map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        {idx < currentStepIndex ? (
                                            <span className="text-emerald-400 font-bold w-5">✓</span>
                                        ) : idx === currentStepIndex ? (
                                            <span className="text-yellow-400 font-bold w-5">⏳</span>
                                        ) : (
                                            <span className="text-gray-600 font-bold w-5">•</span>
                                        )}
                                        <span className={`text-sm ${idx <= currentStepIndex ? 'text-gray-300' : 'text-gray-600'}`}>{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-2 bg-[#13111C] rounded-xl h-[300px] animate-pulse" />
                    </div>
                </motion.div>
            ) : error ? (
                <motion.div 
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center h-[70vh] text-gray-400"
                >
                    <div className="bg-[#13111C] border border-red-500/20 rounded-xl p-8 max-w-md w-full text-center">
                        <h2 className="text-xl font-bold text-white mb-2">Unable to Load Analytics</h2>
                        <p className="text-gray-400 text-sm mb-6">We're having trouble fetching your personal metrics.</p>
                        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#2D2B45] hover:bg-[#3D3B55] text-white rounded-lg transition-colors text-sm font-medium">
                            Retry
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8 pb-12"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Personal Analytics</h1>
                        <p className="text-gray-400 mt-1">AI-powered insights into your productivity and work patterns.</p>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { label: 'Completion Rate', value: `${analyticsData.completionRate}%`, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                            { label: 'Tasks Completed', value: analyticsData.tasksCompleted, icon: CheckSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { label: 'SubTasks Completed', value: analyticsData.subTasksCompleted, icon: ListTodo, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                            { label: 'WorkItems Completed', value: analyticsData.workItemsCompleted, icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                            { label: 'Avg Completion Time', value: analyticsData.averageCompletionTime, icon: Clock, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                        ].map((card, idx) => (
                            <div key={idx} className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col justify-between hover:border-[#4d4b65] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${card.bg}`}>
                                        <card.icon className={`w-5 h-5 ${card.color}`} />
                                    </div>
                                    <div className="text-2xl font-bold text-white">{card.value}</div>
                                </div>
                                <p className="text-gray-400 text-xs font-medium mt-4 uppercase tracking-wider">{card.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* AI Insights Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-gradient-to-br from-[#13111C] to-[#1a1829] border border-[#2D2B45] rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <BrainCircuit className="w-24 h-24 text-purple-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
                                    <Zap className="w-5 h-5 text-purple-400" /> Personal AI Insights
                                </h2>
                                
                                {analyticsData.aiInsights?.summary && (
                                    <div className="mb-5 pb-4 border-b border-[#2D2B45] relative z-10 flex justify-between items-start gap-4">
                                        <p className="text-sm text-gray-300 font-medium italic">"{analyticsData.aiInsights.summary}"</p>
                                        {analyticsData.aiInsights.performanceScore > 0 && (
                                            <div className="flex-shrink-0 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-lg text-sm font-bold">
                                                {analyticsData.aiInsights.performanceScore}/10
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {analyticsData.aiInsights?.strengths?.length > 0 ? (
                                    <div className="space-y-3 relative z-10 mb-6">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Strengths</h3>
                                        {analyticsData.aiInsights.strengths.map((strength, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <Target className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-gray-300 leading-relaxed">{strength}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    !analyticsData.aiInsights?.summary && <p className="text-gray-500 text-sm">Analytics will appear after you begin completing work.</p>
                                )}

                                {analyticsData.aiInsights?.risks?.length > 0 && (
                                     <div className="mb-6 pt-2 relative z-10">
                                         <h3 className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-3">Risks</h3>
                                         <ul className="space-y-2">
                                             {analyticsData.aiInsights.risks.map((risk, idx) => (
                                                 <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                                                     <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" /> {risk}
                                                 </li>
                                             ))}
                                         </ul>
                                     </div>
                                )}

                                {analyticsData.aiInsights?.recommendations?.length > 0 && (
                                     <div className="pt-5 border-t border-[#2D2B45] relative z-10">
                                         <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-3">Recommendations</h3>
                                         <ul className="space-y-2">
                                             {analyticsData.aiInsights.recommendations.map((rec, idx) => (
                                                 <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                                                     <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" /> {rec}
                                                 </li>
                                             ))}
                                         </ul>
                                     </div>
                                )}
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="lg:col-span-2">
                            <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6 h-full min-h-[400px] flex flex-col">
                                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-400" /> Weekly Productivity
                                </h2>
                                <div className="flex-1 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analyticsData.charts?.weeklyProductivity || []}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2D2B45" vertical={false} />
                                            <XAxis dataKey="day" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                                            <YAxis stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                                            <RechartsTooltip 
                                                contentStyle={{ backgroundColor: '#13111C', border: '1px solid #2D2B45', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Bar dataKey="completed" name="Items Completed" radius={[4, 4, 0, 0]}>
                                                {
                                                    (analyticsData.charts?.weeklyProductivity || []).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={index === 4 ? '#8b5cf6' : '#4c1d95'} />
                                                    ))
                                                }
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EmployeeAnalyticsPage;
