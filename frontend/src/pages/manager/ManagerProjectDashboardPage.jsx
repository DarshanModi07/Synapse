import { useParams } from "react-router-dom";

import { useManagerProjectDashboard } from "@/hooks/useManagerProjectDashboard";

import ProjectHeader from "@/components/projectDashboard/ProjectHeader";
import ProjectStatistics from "@/components/projectDashboard/ProjectStatistics";
import ProjectDepartments from "@/components/projectDashboard/ProjectDepartments/ProjectDepartments";
import ProjectTeams from "@/components/projectDashboard/ProjectTeams/ProjectTeams";
import ProjectTaskBoard from "@/components/projectDashboard/ProjectTaskBoard/ProjectTaskBoard";

import { createTask, updateTask, deleteTask } from "@/services/task.service";

const ManagerProjectDashboardPage = () => {
    const { projectId } = useParams();

    const {
        dashboard,
        loading,
        error,
        refresh
    } = useManagerProjectDashboard(projectId);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                Loading Manager Project Dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                Failed to load project dashboard.
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                Project not found.
            </div>
        );
    }

    const handleTaskCreate = async (data) => {
        try {
            await createTask(data.projectTeamId, data);
            refresh();
        } catch (err) {
            console.error(err);
            console.error("Failed to create task");
        }
    };

    const handleTaskEdit = async (taskId, data) => {
        try {
            await updateTask(taskId, data);
            refresh();
        } catch (err) {
            console.error(err);
            console.error("Failed to update task");
        }
    };

    const handleTaskDelete = async (taskId) => {
        try {
            await deleteTask(taskId);
            refresh();
        } catch (err) {
            console.error(err);
            console.error("Failed to delete task");
        }
    };

    return (
        <main className="space-y-8">

            <ProjectHeader
                project={dashboard.project}
                refresh={refresh}
            />

            <ProjectStatistics
                statistics={dashboard.statistics}
            />

            <ProjectDepartments
                projectId={projectId}
                departments={dashboard.departments}
                refresh={refresh}
            />

            <ProjectTeams
                projectId={projectId}
                project={dashboard.project}
                teams={dashboard.teams}
                departments={dashboard.departments}
                refresh={refresh}
            />

            <div className="flex items-center justify-between mt-12 mb-4">
                <h2 className="text-2xl font-semibold text-white">Project Tasks</h2>
            </div>

            <ProjectTaskBoard 
                tasks={dashboard.tasks || []} 
                teams={dashboard.teams || []}
                onTaskCreate={handleTaskCreate}
                onTaskEdit={handleTaskEdit}
                onTaskDelete={handleTaskDelete}
            />

        </main>
    );

};

export default ManagerProjectDashboardPage;
