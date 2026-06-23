import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/landingPage.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRoutes;