import { useCallback, useEffect, useState } from "react";

import {
  getManagerDepartmentTeams,
  createManagerTeam,
  updateManagerTeam,
  deleteManagerTeam,
} from "@/services/manager.service";

export const useManagerDepartmentTeams = (departmentId) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async () => {
    if (!departmentId) {
      setTeams([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getManagerDepartmentTeams(departmentId);
      setTeams(response.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setTeams([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const addTeam = async (data) => {
    try {
      setCreating(true);
      await createManagerTeam(departmentId, data);
      await fetchTeams();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const editTeam = async (teamId, data) => {
    try {
      setUpdating(true);
      await updateManagerTeam(teamId, data);
      await fetchTeams();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const removeTeam = async (teamId) => {
    try {
      setDeleting(true);
      await deleteManagerTeam(teamId);
      await fetchTeams();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  return {
    teams,
    loading,
    creating,
    updating,
    deleting,
    error,
    refresh: fetchTeams,
    addTeam,
    editTeam,
    removeTeam,
  };
};
