import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useEmployeeDashboard } from '../../hooks/useEmployeeDashboard';
import { useEmployeeTasks } from '../../hooks/useEmployeeTasks'; // We need this for updateStatus

// Components
import EmployeeOverviewCards from '../../components/employee/EmployeeOverviewCards';
import EmployeeSubTaskBoard from '../../components/employee/EmployeeSubTaskBoard';
import EmployeeDeadlineWidget from '../../components/employee/EmployeeDeadlineWidget';
import EmployeeRecentAssignments from '../../components/employee/EmployeeRecentAssignments';
import EmployeePriorityAlerts from '../../components/employee/EmployeePriorityAlerts';

import EmployeeProductivityCard from '../../components/employee/EmployeeProductivityCard';
import EmployeeTeamBreakdown from '../../components/employee/EmployeeTeamBreakdown';
import EmployeeAIInsights from '../../components/employee/EmployeeAIInsights';
import EmployeeActivityTimeline from '../../components/employee/EmployeeActivityTimeline';
import EmployeeProgressOverview from '../../components/employee/EmployeeProgressOverview';

const EmployeeDashboardPage = () => {
    const { dashboardData, loading, error, refetch } = useEmployeeDashboard();
    const { updateStatus } = useEmployeeTasks();

    const handleUpdateStatus = async (type, id, status, progress, actualHours) => {
        try {
            await updateStatus(type, id, status, progress, actualHours);
            refetch(true); // Silent refresh to avoid UI flicker
        } catch (e) {
            console.error("Error updating status", e);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 pb-12">
                <div>
                    <div className="h-10 w-64 bg-[#13111C] rounded animate-pulse" />
                    <div className="h-4 w-96 bg-[#13111C] rounded animate-pulse mt-2" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-[#13111C] rounded-2xl p-5 h-24 animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="h-96 w-full bg-[#13111C] rounded-xl animate-pulse" />
                        <div className="h-64 w-full bg-[#13111C] rounded-xl animate-pulse" />
                        <div className="h-64 w-full bg-[#13111C] rounded-xl animate-pulse" />
                    </div>
                    <div className="lg:col-span-4 space-y-8">
                        <div className="h-64 w-full bg-[#13111C] rounded-xl animate-pulse" />
                        <div className="h-96 w-full bg-[#13111C] rounded-xl animate-pulse" />
                        <div className="h-48 w-full bg-[#13111C] rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400">
                <div className="bg-[#13111C] border border-red-500/20 rounded-xl p-8 max-w-md w-full text-center flex flex-col items-center">
                    <div className="p-3 bg-red-500/10 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Unable to Load Dashboard</h2>
                    <p className="text-gray-400 text-sm mb-6">We're having trouble loading your work data.</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#2D2B45] hover:bg-[#3D3B55] text-white rounded-lg transition-colors text-sm font-medium">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!dashboardData) return null;

    return (
        <div className="space-y-6 pb-12 max-w-[1400px] mx-auto mt-4">
            <div>
                <h1 className="text-[32px] font-bold text-[#F9FAFB] tracking-tight">Employee Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back. Here's everything assigned to you across all teams.</p>
            </div>

            {/* Top Overview Cards */}
            <EmployeeOverviewCards dashboardData={dashboardData} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column (70% - ~8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <EmployeeSubTaskBoard subTasks={dashboardData.subTasks} updateStatus={handleUpdateStatus} />
                    <EmployeeDeadlineWidget deadlines={dashboardData.deadlines} />
                    <EmployeeRecentAssignments assignments={dashboardData.recentAssignments} />
                    <EmployeePriorityAlerts priorityAlerts={dashboardData.priorityAlerts} />
                </div>

                {/* Right Column (30% - ~4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <EmployeeProductivityCard productivity={dashboardData.productivity} />
                    <EmployeeTeamBreakdown teams={dashboardData.teamBreakdown} />
                    <EmployeeActivityTimeline activity={dashboardData.activity} />
                    <EmployeeProgressOverview progressOverview={dashboardData.progressOverview} />
                </div>

            </div>
        </div>
    );
};

export default EmployeeDashboardPage;