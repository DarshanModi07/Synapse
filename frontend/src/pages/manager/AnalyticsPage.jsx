import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useManagerAnalytics } from "@/hooks/useManagerAnalytics";
import { theme } from "@/lib/theme";

import { StatsCards } from "@/components/owner/dashboard/StatsCards";
import { ProgressCard } from "@/components/owner/dashboard/ProgressCard";

import {
    Activity,
    BarChart3,
    Brain,
    CalendarClock,
    ChartColumn,
    Users,
    AlertTriangle,
    CheckCircle,
    UserCircle,
    Siren
} from "lucide-react";

const ManagerAnalyticsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { analytics, loading, error } = useManagerAnalytics();

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="text-gray-400">Loading Manager Analytics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!analytics) return null;

    const overview = {
        departments: analytics.departmentCount,
        teams: analytics.teamCount,
        projects: analytics.projectCount,
        tasks: analytics.taskCount,
    };

    const progressData = {
        total: analytics.taskCount,
        completed: analytics.completedTasks,
        percentage: analytics.completionRate,
    };

    const ai = analytics.aiInsights;

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Manager Analytics</h1>
                <p className="text-gray-400">Comprehensive overview of your managed departments.</p>
            </div>

            {/* Section 1: Statistic Cards */}
            <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" /> Top Statistics
                </h2>
                <StatsCards overview={overview} />
            </section>

            {/* Section 2: Progress & Completion */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" /> Completion Rate
                    </h2>
                    <ProgressCard progress={progressData} />
                </div>
                
                {/* Simplified placeholder for charts to avoid breaking without recharts specific imports */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" /> Tasks by Status
                    </h2>
                    <div 
                        className="rounded-3xl p-8 h-[220px] flex items-center justify-center"
                        style={{
                            background: "rgba(13,13,18,.55)",
                            border: "1px solid rgba(167,139,250,.10)",
                            backdropFilter: "blur(20px)"
                        }}
                    >
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-gray-200">{analytics.completedTasks}</div>
                                <div className="text-sm text-gray-500 mt-2">Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-gray-200">{analytics.pendingTasks}</div>
                                <div className="text-sm text-gray-500 mt-2">Pending</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 6: AI Insights */}
            <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-fuchsia-400" /> AI Insights
                </h2>
                <div 
                    className="rounded-3xl p-8 space-y-8"
                    style={{
                        background: "rgba(13,13,18,.55)",
                        border: "1px solid rgba(167,139,250,.10)",
                        backdropFilter: "blur(20px)"
                    }}
                >
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-2xl">
                                <Activity className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-200">Department Health</h3>
                                <p className="text-gray-400 text-sm">AI assessed overall health score</p>
                            </div>
                        </div>
                        <div className="text-5xl font-bold text-white">
                            {ai?.departmentHealthScore}<span className="text-2xl text-gray-500">/100</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Overloaded Teams */}
                        <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10">
                            <div className="flex items-center gap-2 text-red-400 font-medium mb-3">
                                <AlertTriangle className="w-4 h-4" /> Overloaded Teams
                            </div>
                            {ai?.overloadedTeams?.length > 0 ? (
                                <ul className="space-y-2">
                                    {ai.overloadedTeams.map((t, i) => (
                                        <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" /> {t}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-gray-500">No overloaded teams.</div>
                            )}
                        </div>

                        {/* Underutilized Teams */}
                        <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                            <div className="flex items-center gap-2 text-blue-400 font-medium mb-3">
                                <Activity className="w-4 h-4" /> Underutilized Teams
                            </div>
                            {ai?.underutilizedTeams?.length > 0 ? (
                                <ul className="space-y-2">
                                    {ai.underutilizedTeams.map((t, i) => (
                                        <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" /> {t}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-gray-500">Resource allocation optimal.</div>
                            )}
                        </div>

                        {/* Delayed Projects */}
                        <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                            <div className="flex items-center gap-2 text-orange-400 font-medium mb-3">
                                <CalendarClock className="w-4 h-4" /> Delayed Projects
                            </div>
                            {ai?.delayedProjects?.length > 0 ? (
                                <ul className="space-y-2">
                                    {ai.delayedProjects.map((p, i) => (
                                        <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50" /> {p}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-gray-500">All projects on track.</div>
                            )}
                        </div>
                    </div>

                    {/* AI Suggestions & Risk Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                                <Brain className="w-4 h-4 text-purple-400" /> Suggested Assignments
                            </h4>
                            <ul className="space-y-3">
                                {ai?.suggestedAssignments?.map((s, i) => (
                                    <li key={i} className="text-gray-400 text-sm leading-relaxed flex items-start gap-3">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                        {s}
                                    </li>
                                ))}
                                {!ai?.suggestedAssignments?.length && (
                                    <div className="text-sm text-gray-500">No suggestions at this time.</div>
                                )}
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                                <Siren className="w-4 h-4 text-red-400" /> Risk Analysis
                            </h4>
                            <ul className="space-y-3">
                                {ai?.riskAnalysis?.map((r, i) => (
                                    <li key={i} className="text-gray-400 text-sm leading-relaxed flex items-start gap-3">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                        {r}
                                    </li>
                                ))}
                                {!ai?.riskAnalysis?.length && (
                                    <div className="text-sm text-gray-500">No critical risks identified.</div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ManagerAnalyticsPage;