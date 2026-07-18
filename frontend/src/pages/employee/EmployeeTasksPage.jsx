import React from 'react';
import { useEmployeeTasks } from '../../hooks/useEmployeeTasks';
import EmployeeSubTaskBoard from '../../components/employee/EmployeeSubTaskBoard';

const EmployeeTasksPage = () => {
    const { tasksData, loading, error, updateStatus } = useEmployeeTasks();

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-48 bg-[#13111C] rounded animate-pulse" />
                <div className="h-12 w-full bg-[#13111C] rounded animate-pulse" />
                <div className="grid grid-cols-1 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-48 w-full bg-[#13111C] rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400">
                <div className="bg-[#13111C] border border-red-500/20 rounded-xl p-8 max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Unable to Load Assignments</h2>
                    <p className="text-gray-400 text-sm mb-6">We're having trouble fetching your assignments.</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#2D2B45] hover:bg-[#3D3B55] text-white rounded-lg transition-colors text-sm font-medium">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { subTasks } = tasksData || {};

    return (
        <div className="space-y-8 pb-12 max-w-[1400px] mx-auto">
            <div>
                <h1 className="text-[32px] font-bold text-[#F9FAFB] tracking-tight">Assigned Work</h1>
                <p className="text-gray-400 mt-1">Complete your assigned work items to update progress automatically.</p>
            </div>

            <EmployeeSubTaskBoard subTasks={subTasks} updateStatus={updateStatus} />
        </div>
    );
};

export default EmployeeTasksPage;
