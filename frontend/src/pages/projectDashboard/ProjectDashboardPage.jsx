import { useParams } from "react-router-dom";

import { useProjectDashboard } from "@/hooks/useProjectDashboard";

import ProjectHeader from "@/components/projectDashboard/ProjectHeader";
import ProjectStatistics from "@/components/projectDashboard/ProjectStatistics";
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

                teams={dashboard.teams}

                departments={dashboard.departments}

                refresh={refresh}

            />

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