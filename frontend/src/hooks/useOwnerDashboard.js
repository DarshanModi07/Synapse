import { useEffect, useState } from "react";

import { useWorkspace } from "@/context/WorkspaceContext";
import { getOwnerDashboard } from "@/services/workspace.service";

export const useOwnerDashboard = () => {
  const { workspace } = useWorkspace();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    if (!workspace?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getOwnerDashboard(workspace.id);

      setDashboard(response);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [workspace?.id]);

  return {
    workspace,

    dashboard,

    overview: dashboard?.overview || {},

    progress: dashboard?.progress || {},

    recentProjects: dashboard?.recentProjects || [],

    loading,

    error,

    refetch: fetchDashboard,
  };
};