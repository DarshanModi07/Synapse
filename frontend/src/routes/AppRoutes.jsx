import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import LandingPage from "@/pages/landingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

import AllWorkspacesPage from "@/pages/AllWorkspacesPage";
import ProfilePage from "@/pages/ProfilePage";
import WorkspacePage from "@/pages/WorkspacePage";
import OwnerLayout from "@/layouts/OwnerLayout";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

import DashboardPage from "@/pages/owner/DashboardPage";
import DepartmentsPage from "@/pages/owner/DepartmentsPage";
import TeamsPage from "@/pages/owner/TeamsPage";
import ProjectsPage from "@/pages/owner/ProjectsPage";
import MembersPage from "@/pages/owner/MembersPage";
import AnalyticsPage from "@/pages/owner/AnalyticsPage";
import SettingsPage from "@/pages/owner/SettingsPage";
import DepartmentDashboardPage from "@/pages/owner/DepartmentDashboardPage";
import TeamDashboardPage from "@/pages/owner/TeamDashboardPage";
import ProjectDashboardPage from "@/pages/projectDashboard/ProjectDashboardPage";
import ProjectTeamDashboardPage from "@/pages/projectTeamDashboard/ProjectTeamDashboardPage";

import ManagerLayout from "@/layouts/ManagerLayout";
import TeamLeadLayout from "@/layouts/TeamLeadLayout";
import EmployeeLayout from "@/layouts/EmployeeLayout";

import ManagerDashboardPage from "@/pages/manager/DashboardPage";
import ManagerTeamsPage from "@/pages/manager/TeamsPage";
import ManagerProjectsPage from "@/pages/manager/ProjectsPage";
import ManagerProjectDashboardPage from "@/pages/manager/ManagerProjectDashboardPage";
import ManagerMembersPage from "@/pages/manager/ManagerMembersPage";
import ManagerTasksPage from "@/pages/manager/TasksPage";
import ManagerAnalyticsPage from "@/pages/manager/AnalyticsPage";
import ManagerSettingsPage from "@/pages/manager/SettingsPage";
import ManagerDepartmentDashboardPage from "@/pages/manager/DepartmentDashboardPage";
import ManagerTeamDashboardPage from "@/pages/manager/TeamDashboardPage";

import TeamLeadDashboard from "@/pages/teamLead/DashboardPage";
import EmployeeDashboard from "@/pages/employee/DashboardPage";

const ProtectedRoute = ({ children }) => {
  const { profile } = useAuth();

  return profile
    ? children
    : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const { profile } = useAuth();

  return !profile
    ? children
    : <Navigate to="/workspace" replace />;
};

const AppRoutes = () => {

  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (

    <Routes>

      {/* Public */}

      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Workspace List */}

      <Route
        path="/workspace"
        element={
          <ProtectedRoute>
            <AllWorkspacesPage />
          </ProtectedRoute>
        }
      />

      {/* Workspace */}

      <Route
        path="/workspace/:slug"
        element={
          <ProtectedRoute>
            <WorkspacePage />
          </ProtectedRoute>
        }
      >

        {/* Owner Layout */}

        <Route element={
          <RoleProtectedRoute allowedRole="owner">
            <OwnerLayout />
          </RoleProtectedRoute>
        }>

          <Route
            index
            element={<DashboardPage />}
          />

          <Route
            path="departments"
            element={<DepartmentsPage />}
          />

          <Route
            path="departments/:departmentId"
            element={<DepartmentDashboardPage />}
          />

          <Route
            path="teams"
            element={<TeamsPage />}
          />

          <Route
              path="teams/:teamId"
              element={<TeamDashboardPage />}
          />

          <Route
            path="projects"
            element={<ProjectsPage />}
          />

          <Route
            path="projects/:projectId"
            element={<ProjectDashboardPage/>}
          />

          <Route
              path="project-team/:projectTeamId"
              element={<ProjectTeamDashboardPage />}
          />

          <Route
            path="members"
            element={<MembersPage />}
          />

          <Route
            path="analytics"
            element={<AnalyticsPage />}
          />

          <Route
            path="settings"
            element={<SettingsPage />}
          />

        </Route>

        {/* Manager Layout */}
        <Route path="manager" element={
          <RoleProtectedRoute allowedRole="manager">
            <ManagerLayout />
          </RoleProtectedRoute>
        }>
          <Route index element={<ManagerDashboardPage />} />
          <Route path="teams" element={<ManagerTeamsPage />} />
          <Route path="projects" element={<ManagerProjectsPage />} />
          <Route path="projects/:projectId" element={<ManagerProjectDashboardPage />} />
          <Route path="members" element={<ManagerMembersPage />} />
          <Route path="tasks" element={<ManagerTasksPage />} />
          <Route path="analytics" element={<ManagerAnalyticsPage />} />
          <Route path="settings" element={<ManagerSettingsPage />} />
          <Route path="departments/:departmentId" element={<ManagerDepartmentDashboardPage />} />
          <Route path="departments/:departmentId/teams" element={<ManagerTeamsPage />} />
          <Route path="teams/:teamId" element={<ManagerTeamDashboardPage />} />
          <Route path="project-team/:projectTeamId" element={<ProjectTeamDashboardPage />} />
        </Route>

        {/* Team Lead Layout */}
        <Route path="team-lead" element={
          <RoleProtectedRoute allowedRole="team_lead">
            <TeamLeadLayout />
          </RoleProtectedRoute>
        }>
          <Route index element={<TeamLeadDashboard />} />
        </Route>

        {/* Employee Layout */}
        <Route path="employee" element={
          <RoleProtectedRoute allowedRole="employee">
            <EmployeeLayout />
          </RoleProtectedRoute>
        }>
          <Route index element={<EmployeeDashboard />} />
        </Route>

      </Route>

      {/* Profile */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>

  );

};

export default AppRoutes;