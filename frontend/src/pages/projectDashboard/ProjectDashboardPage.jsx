import { useParams } from "react-router-dom";

import { useProjectDashboard } from "@/hooks/useProjectDashboard";

import ProjectHeader from "@/components/projectDashboard/ProjectHeader";
import ProjectStatistics from "@/components/projectDashboard/ProjectStatistics";
import { ProjectErrorBoundary } from "@/components/projectDashboard/ProjectErrorBoundary";
import ProjectDepartments from "@/components/projectDashboard/ProjectDepartments/ProjectDepartments";
import ProjectTeams from "@/components/projectDashboard/ProjectTeams/ProjectTeams";
// import RecentTasks from "@/components/projectDashboard/RecentTasks";
// import ActivityTimeline from "@/components/projectDashboard/ActivityTimeline";

const ProjectDashboardPage = () => {

    const { projectId } = useParams();
    console.log("Project ID:", projectId);

    const {

        dashboard,

        loading,

        error,

        refresh

    } = useProjectDashboard(projectId);

    if (loading) {

        return (

            <div className="flex h-[80vh] items-center justify-center">

                Loading Project Dashboard...

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

    return (

        <main className="space-y-8">

            <ProjectErrorBoundary>
                <ProjectHeader
                    project={dashboard?.project || {}}
                    refresh={refresh}
                />
            </ProjectErrorBoundary>

            <ProjectErrorBoundary>
                <ProjectStatistics
                    statistics={dashboard?.statistics || dashboard || {}}
                />
            </ProjectErrorBoundary>

            <ProjectErrorBoundary>
                <ProjectDepartments
                    projectId={projectId}
                    departments={dashboard?.departments || []}
                    refresh={refresh}
                />
            </ProjectErrorBoundary>

            <ProjectErrorBoundary>
                <ProjectTeams
                    teams={dashboard?.teams || []}
                    departments={dashboard?.departments || []}
                    projectId={projectId}
                    refresh={refresh}
                />
            </ProjectErrorBoundary>

            {/* <RecentTasks

                tasks={dashboard.recentTasks}

            />

            <ActivityTimeline

                activity={dashboard.activity}

            /> */}

        </main>

    );

};

export default ProjectDashboardPage;