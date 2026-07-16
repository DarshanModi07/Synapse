import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const aiAnalysisSteps = [
    "Team Productivity",
    "Completion Rates",
    "Delayed Tasks",
    "Team Health Scores",
    "Risk Analysis",
    "Upcoming Deadlines",
    "AI Recommendations",
    "Performance Trends"
];

const TeamLeadAnalyticsLoading = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStepIndex((prev) => {
                if (prev < aiAnalysisSteps.length - 1) {
                    return prev + 1;
                }
                // Once all are done, hold on the last one
                return prev;
            });
        }, 1000); // 1 second per item
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 pb-20 max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Team Analytics</h1>
                <p className="text-gray-400 mt-1 max-w-2xl flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    Analyzing your teams and generating AI insights...
                </p>
            </div>

            {/* Overview Card Skeletons */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col gap-3">
                        <div className="w-6 h-6 rounded-md bg-[#2D2B45] animate-pulse" />
                        <div className="w-20 h-3 rounded bg-[#2D2B45] animate-pulse" />
                        <div className="w-12 h-8 rounded bg-[#2D2B45] animate-pulse" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                
                {/* AI Insights Loader (Col span 2 on large screens) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6 border-b border-[#2D2B45] pb-4">
                            <h3 className="text-white font-semibold text-lg">AI Analytics Engine</h3>
                            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                        </div>
                        
                        <div className="space-y-4">
                            {aiAnalysisSteps.map((step, index) => {
                                let statusIcon;
                                let textClass;

                                if (index < currentStepIndex) {
                                    statusIcon = <span className="text-emerald-400 font-bold w-5">✓</span>;
                                    textClass = "text-gray-300";
                                } else if (index === currentStepIndex) {
                                    statusIcon = <span className="text-yellow-400 font-bold w-5">⏳</span>;
                                    textClass = "text-white font-medium animate-pulse";
                                } else {
                                    statusIcon = <span className="text-gray-600 font-bold w-5">•</span>;
                                    textClass = "text-gray-600";
                                }

                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        {statusIcon}
                                        <span className={`text-sm ${textClass}`}>{step}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Team Performance Skeletons */}
                    <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6 space-y-4">
                        <h3 className="text-white font-semibold text-sm mb-2">Compiling Team Data</h3>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-[#08070F] border border-[#2D2B45] rounded-lg p-4 animate-pulse">
                                <div className="h-4 w-32 bg-[#2D2B45] rounded mb-3" />
                                <div className="flex justify-between items-center mb-2">
                                    <div className="h-3 w-16 bg-[#2D2B45] rounded" />
                                    <div className="h-3 w-8 bg-[#2D2B45] rounded" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="h-3 w-20 bg-[#2D2B45] rounded" />
                                    <div className="h-3 w-12 bg-[#2D2B45] rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Chart Placeholders */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6 h-[300px] flex flex-col">
                        <div className="h-4 w-40 bg-[#2D2B45] rounded mb-auto animate-pulse" />
                        <div className="flex justify-center items-center h-full">
                            <div className="w-32 h-32 rounded-full border-8 border-[#2D2B45] animate-pulse" />
                        </div>
                    </div>
                    <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6 h-[300px] flex flex-col">
                        <div className="h-4 w-40 bg-[#2D2B45] rounded mb-auto animate-pulse" />
                        <div className="flex justify-between items-end h-40 gap-2 mt-auto">
                            <div className="w-1/4 h-[40%] bg-[#2D2B45] rounded-t animate-pulse" />
                            <div className="w-1/4 h-[70%] bg-[#2D2B45] rounded-t animate-pulse" />
                            <div className="w-1/4 h-[50%] bg-[#2D2B45] rounded-t animate-pulse" />
                            <div className="w-1/4 h-[90%] bg-[#2D2B45] rounded-t animate-pulse" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Progress Message */}
            <div className="text-center mt-12 mb-8">
                <p className="text-gray-400 font-medium">
                    AI is analyzing all teams under your leadership.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                    This may take a few seconds.
                </p>
            </div>
        </motion.div>
    );
};

export default TeamLeadAnalyticsLoading;
