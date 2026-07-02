import { useCallback, useEffect, useState } from "react";

import {
  getWorkspaceTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "@/services/team.service";

export const useTeams = (workspaceId) => {

  const [teams, setTeams] = useState([]);

  const [pagination, setPagination] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [updating, setUpdating] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState(null);

  const fetchTeams = useCallback(
    async (page = 1) => {

      if (!workspaceId) {
        setTeams([]);
        return;
      }

      try {

        setLoading(true);

        const response =
          await getWorkspaceTeams(
            workspaceId,
            page
          );

        setTeams(response.data || []);

        setPagination(
          response.pagination || null
        );

        setError(null);

      }
      catch (err) {

        console.error(err);

        setTeams([]);

        setError(err);

      }
      finally {

        setLoading(false);

      }

    },
    [workspaceId]
  );

  useEffect(() => {

    fetchTeams();

  }, [fetchTeams]);

  const addTeam = async (data) => {

    try {

      setCreating(true);

      await createTeam(data);

      await fetchTeams();

    }
    catch (err) {

      console.error(err);

      throw err;

    }
    finally {

      setCreating(false);

    }

  };

  const editTeam = async (
    teamId,
    data
  ) => {

    try {

      setUpdating(true);

      await updateTeam(
        teamId,
        data
      );

      await fetchTeams();

    }
    catch (err) {

      console.error(err);

      throw err;

    }
    finally {

      setUpdating(false);

    }

  };

  const removeTeam = async (
    teamId
  ) => {

    try {

      setDeleting(true);

      await deleteTeam(teamId);

      await fetchTeams();

    }
    catch (err) {

      console.error(err);

      throw err;

    }
    finally {

      setDeleting(false);

    }

  };

  return {

    teams,

    pagination,

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