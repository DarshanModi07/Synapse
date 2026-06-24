import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/landingPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx"
import LoginPage from "../pages/LoginPage.jsx"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;