import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import LandingPage from "@/pages/landingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

import AllWorkspacesPage from "@/pages/AllWorkspacesPage";
import ProfilePage from "@/pages/ProfilePage";
import WorkspacePage from "@/pages/WorkspacePage";
import OwnerLayout from "@/layouts/OwnerLayout";

import DashboardPage from "@/pages/owner/DashboardPage";
import DepartmentsPage from "@/pages/owner/DepartmentsPage";
import TeamsPage from "@/pages/owner/TeamsPage";
import ProjectsPage from "@/pages/owner/ProjectsPage";
import MembersPage from "@/pages/owner/MembersPage";
import AnalyticsPage from "@/pages/owner/AnalyticsPage";
import AIInsightsPage from "@/pages/owner/AIInsightsPage";
import SettingsPage from "@/pages/owner/SettingsPage";
import DepartmentDashboardPage from "@/pages/owner/DepartmentDashboardPage";
import TeamDashboardPage from "@/pages/owner/TeamDashboardPage";

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

        <Route element={<OwnerLayout />}>

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
            path="members"
            element={<MembersPage />}
          />

          <Route
            path="analytics"
            element={<AnalyticsPage />}
          />

          <Route
            path="ai"
            element={<AIInsightsPage />}
          />

          <Route
            path="settings"
            element={<SettingsPage />}
          />

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