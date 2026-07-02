import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getTeamDashboard,
} from "@/services/teamDashboard.service";

export const useTeamDashboard = (
  teamId
) => {

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const fetchDashboard =
    useCallback(async () => {

      if (!teamId) return;

      try {

        setLoading(true);

        const response =
          await getTeamDashboard(
            teamId
          );

        setDashboard(response.data);

        setError(null);

      }
      catch (err) {

        console.error(err);

        setError(err);

      }
      finally {

        setLoading(false);

      }

    }, [teamId]);

  useEffect(() => {

    fetchDashboard();

  }, [fetchDashboard]);

  return {

    dashboard,

    loading,

    error,

    refresh:
      fetchDashboard,

  };

};