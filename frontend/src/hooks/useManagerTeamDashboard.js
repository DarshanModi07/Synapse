import { useCallback, useEffect, useState } from "react";
import { getManagerTeamDashboard } from "@/services/manager.service";

export const useManagerTeamDashboard = (teamId) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    if (!teamId) return;

    try {
      setLoading(true);
      const response = await getManagerTeamDashboard(teamId);
      setDashboard(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refresh: fetchDashboard };
};
