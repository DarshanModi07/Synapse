// AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import LandingPage from "@/pages/landingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AllWorkspacesPage from "@/pages/AllWorkspacesPage";
import ProfilePage from "@/pages/ProfilePage";
import WorkspacePage from "@/pages/WorkspacePage";

const ProtectedRoute = ({ children }) => {
  const { profile } = useAuth();
  return profile ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const { profile } = useAuth();
  return !profile ? children : <Navigate to="/workspace" replace />;
};

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/workspace/:slug" element={<ProtectedRoute><WorkspacePage/></ProtectedRoute>} />
      <Route path="/workspace" element={<ProtectedRoute><AllWorkspacesPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;