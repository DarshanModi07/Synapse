import React from 'react';
import { 
    Brain, 
    TrendingUp, 
    Clock, 
    AlertTriangle, 
    CheckCircle, 
    XCircle, 
    Target, 
    ShieldAlert, 
    TrendingDown,
    Briefcase,
    Users,
    Calendar,
    BarChart2,
    MessageSquare,
    Activity
} from 'lucide-react';

const ProgressBar = ({ label, value, color = "bg-blue-500" }) => (
    <div className="mb-3">
        <div className="flex justify-between text-[13px] mb-1">
            <span className="text-gray-400">{label}</span>
            <span className="text-gray-200 font-medium">{value}/100</span>
        </div>
        <div className="h-2 w-full bg-[#1A1825] rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
        </div>
    </div>
);

const EmployeeAIInsights = ({ aiInsights }) => {
    if (!aiInsights || !aiInsights.executiveSummary) {
        return (
            <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-6 text-center text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Generating performance insights...</p>
            </div>
        );
    }

    const {
        executiveSummary,
        productivityScore,
        workloadAnalysis,
        performanceTrend,
        timeManagement,
        riskAssessment,
        strengths = [],
        weaknesses = [],
        recommendations = [],
        burnoutDetection,
        careerInsights,
        teamComparison,
        weeklyBreakdown = {},
        improvementPlan = {},
        managerNotes
    } = aiInsights;

    const getBurnoutColor = (level) => {
        switch(level?.toUpperCase()) {
            case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'MEDIUM': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'LOW': default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        }
    };

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-[#2D2B45] bg-gradient-to-r from-[#1A1825] to-[#13111C] flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Brain className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-[16px] font-bold text-white tracking-tight">AI Performance Report</h2>
                        <p className="text-[12px] text-gray-400">Enterprise Intelligence Analysis</p>
                    </div>
                </div>
                {productivityScore?.overall > 0 && (
                    <div className="text-right">
                        <div className="text-[24px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            {productivityScore.overall}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Overall Score</div>
                    </div>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="p-5 space-y-6 overflow-y-auto max-h-[800px] custom-scrollbar">
                
                {/* Executive Summary */}
                <section>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" /> Executive Summary
                    </h3>
                    <p className="text-[14px] text-gray-300 leading-relaxed bg-[#1A1825]/50 p-4 rounded-xl border border-[#2D2B45]/50">
                        {executiveSummary}
                    </p>
                </section>

                {/* Grid: Productivity & Trends */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-[#1A1825]/50 p-4 rounded-xl border border-[#2D2B45]/50">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                            <BarChart2 className="w-3.5 h-3.5" /> Core Metrics
                        </h3>
                        <ProgressBar label="Productivity" value={productivityScore?.productivity || 0} color="bg-blue-500" />
                        <ProgressBar label="Quality" value={productivityScore?.qualityScore || 0} color="bg-emerald-500" />
                        <ProgressBar label="Reliability" value={productivityScore?.reliability || 0} color="bg-purple-500" />
                        <ProgressBar label="Collaboration" value={productivityScore?.collaboration || 0} color="bg-pink-500" />
                    </section>

                    <section className="bg-[#1A1825]/50 p-4 rounded-xl border border-[#2D2B45]/50 flex flex-col justify-between">
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5" /> Performance Trend
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-[#2D2B45]">
                                    <span className="text-gray-400 text-[13px]">Last 7 Days</span>
                                    <span className="text-emerald-400 font-semibold">{performanceTrend?.last7Days || '0%'}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-[#2D2B45]">
                                    <span className="text-gray-400 text-[13px]">Last 30 Days</span>
                                    <span className="text-blue-400 font-semibold">{performanceTrend?.last30Days || '0%'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-[13px]">Last 90 Days</span>
                                    <span className="text-gray-300 font-semibold">{performanceTrend?.last90Days || 'Stable'}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Workload & Burnout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-[#1A1825]/50 p-4 rounded-xl border border-[#2D2B45]/50">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5" /> Workload Analysis
                        </h3>
                        <p className="text-[13px] text-gray-300 leading-relaxed">{workloadAnalysis}</p>
                    </section>

                    <section className="bg-[#1A1825]/50 p-4 rounded-xl border border-[#2D2B45]/50">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                <ShieldAlert className="w-3.5 h-3.5" /> Burnout Detection
                            </h3>
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border uppercase tracking-wider ${getBurnoutColor(burnoutDetection)}`}>
                                {burnoutDetection || 'LOW'} RISK
                            </span>
                        </div>
                        <p className="text-[13px] text-gray-300 leading-relaxed">{riskAssessment}</p>
                    </section>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-emerald-500/70 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5" /> Key Strengths
                        </h3>
                        <ul className="space-y-2">
                            {strengths.map((str, i) => (
                                <li key={i} className="text-[13px] text-gray-300 flex items-start gap-2">
                                    <span className="text-emerald-500 mt-0.5">•</span> <span>{str}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/20">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-orange-500/70 mb-3 flex items-center gap-2">
                            <XCircle className="w-3.5 h-3.5" /> Areas for Improvement
                        </h3>
                        <ul className="space-y-2">
                            {weaknesses.map((weak, i) => (
                                <li key={i} className="text-[13px] text-gray-300 flex items-start gap-2">
                                    <span className="text-orange-500 mt-0.5">•</span> <span>{weak}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Recommendations */}
                <section className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/20">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-blue-500/70 mb-3 flex items-center gap-2">
                        <Target className="w-3.5 h-3.5" /> Actionable Recommendations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {recommendations.map((rec, i) => (
                            <div key={i} className="bg-[#13111C] p-3 rounded-lg border border-[#2D2B45] flex gap-3 items-center shadow-sm">
                                <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-[12px] font-bold shrink-0">
                                    {i + 1}
                                </div>
                                <span className="text-[13px] text-gray-300">{rec}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-[#1A1825]/50 p-4 rounded-xl border border-[#2D2B45]/50">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> Time Management
                        </h3>
                        <p className="text-[13px] text-gray-300 leading-relaxed">{timeManagement}</p>
                    </section>

                    <section className="bg-[#1A1825]/50 p-4 rounded-xl border border-[#2D2B45]/50">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                            <Users className="w-3.5 h-3.5" /> Team Comparison
                        </h3>
                        <p className="text-[13px] text-gray-300 leading-relaxed">{teamComparison}</p>
                    </section>
                </div>

                {/* Plan & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-[#1A1825]/50 p-4 rounded-xl border border-[#2D2B45]/50">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" /> 30-Day Growth Plan
                        </h3>
                        <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#2D2B45] before:to-transparent">
                            {Object.entries(improvementPlan).map(([week, focus], i) => (
                                <div key={week} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[#2D2B45] bg-[#13111C] text-[10px] font-bold text-gray-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                                        W{i + 1}
                                    </div>
                                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-[#2D2B45] bg-[#13111C] shadow">
                                        <p className="text-[12px] text-gray-300">{focus}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-[#1A1825]/50 p-4 rounded-xl border border-[#2D2B45]/50 flex flex-col gap-4">
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5" /> Career Trajectory
                            </h3>
                            <p className="text-[13px] text-gray-300 leading-relaxed">{careerInsights}</p>
                        </div>
                        <div className="pt-4 border-t border-[#2D2B45]">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                                <MessageSquare className="w-3.5 h-3.5" /> Manager Notes
                            </h3>
                            <p className="text-[13px] italic text-gray-400 leading-relaxed border-l-2 border-blue-500/50 pl-3">"{managerNotes}"</p>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
};

export default EmployeeAIInsights;
