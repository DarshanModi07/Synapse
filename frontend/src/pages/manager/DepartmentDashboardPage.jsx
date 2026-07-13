import { useParams, useNavigate } from "react-router-dom";
import { useManagerDepartmentDashboard } from "@/hooks/useManagerDepartmentDashboard";
import DepartmentHero from "@/components/departmentDashboard/DepartmentHero";
import DepartmentStats from "@/components/departmentDashboard/DepartmentStats";
import DepartmentTeams from "@/components/departmentDashboard/DepartmentTeams";
import DepartmentProjects from "@/components/departmentDashboard/DepartmentProjects";
import DepartmentMembers from "@/components/departmentDashboard/DepartmentMembers";

const ManagerDepartmentDashboardPage = () => {
    const { departmentId, slug } = useParams();
    const navigate = useNavigate();
    const { dashboard, loading } = useManagerDepartmentDashboard(departmentId);

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
                    Failed to load department or you do not have permission.
                </div>
            </div>
        );
    }

    return (
        <main className="space-y-8">
            <DepartmentHero department={dashboard.department} />
            <DepartmentStats 
                statistics={{
                    ...dashboard.statistics,
                    onTeamsClick: () => navigate(`/workspace/${slug}/manager/departments/${departmentId}/teams`)
                }} 
            />
            <DepartmentTeams 
                teams={dashboard.teams} 
                basePath={`/workspace/${dashboard.department.workspace.slug}/manager`}
                onViewAll={() => navigate(`/workspace/${slug}/manager/departments/${departmentId}/teams`)}
            />
            <DepartmentProjects projects={dashboard.projects} />
            <DepartmentMembers members={dashboard.members} />
        </main>
    );
};

export default ManagerDepartmentDashboardPage;
