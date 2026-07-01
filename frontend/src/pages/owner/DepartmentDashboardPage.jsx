import { useParams } from "react-router-dom";

import { useDepartmentDashboard } from "@/hooks/useDepartmentDashboard";

import DepartmentHero from "@/components/departmentDashboard/DepartmentHero";
import DepartmentStats from "@/components/departmentDashboard/DepartmentStats";
import DepartmentTeams from "@/components/departmentDashboard/DepartmentTeams";
import DepartmentProjects from "@/components/departmentDashboard/DepartmentProjects";
import DepartmentMembers from "@/components/departmentDashboard/DepartmentMembers";

const DepartmentDashboardPage = () => {

    const { departmentId } = useParams();

    const {
        dashboard,
        loading,
    } = useDepartmentDashboard(departmentId);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="text-lg text-white">
                    Loading Department...
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="text-lg text-red-400">
                    Failed to load department.
                </div>
            </div>
        );
    }

    return (
        <main className="space-y-8">

            <DepartmentHero
                department={dashboard.department}
            />

            <DepartmentStats
                statistics={dashboard.statistics}
            />

            <DepartmentTeams
                teams={dashboard.teams}
            />

            <DepartmentProjects
                projects={dashboard.projects}
            />

            <DepartmentMembers
                members={dashboard.members}
            />

        </main>
    );

};

export default DepartmentDashboardPage;