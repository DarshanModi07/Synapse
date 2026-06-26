import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

import LandingPage from "@/pages/landingPage.jsx";
import  WorkspacePage  from "@/pages/WorkspacePage.jsx";
import  RegisterPage  from "@/pages/RegisterPage.jsx";
import  LoginPage  from "@/pages/LoginPage.jsx";

const AppRoutes = () => {
  const { profile, loading } = useAuth();

  console.log("loading : ",loading)
  console.log("profile : ",profile)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (profile) {
    return (
      <Routes>
        <Route
          path="*"
          element={<WorkspacePage />}
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="*"
        element={<LandingPage />}
      />
    </Routes>
  );
};

export default AppRoutes;