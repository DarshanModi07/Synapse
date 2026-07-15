import { useState, useEffect } from "react";
import teamLeadService from "../services/teamLead.service";

export const useTeamLeadDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const dashboardData = await teamLeadService.getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading, error };
};
