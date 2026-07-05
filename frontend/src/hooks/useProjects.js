import { useCallback, useEffect, useState } from "react";

import {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject
} from "@/services/project.service";

export const useProjects = (workspaceId) => {

    const [projects, setProjects] = useState([]);

    const [pagination, setPagination] = useState(null);

    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);

    const [updating, setUpdating] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async (page = 1) => {

        if (!workspaceId) {

            setProjects([]);

            setLoading(false);

            return;

        }

        try {

            setLoading(true);

            const response = await getAllProjects(
                workspaceId,
                page
            );

            setProjects(response.data || []);

            setPagination(response.pagination || null);

            setError(null);

        }

        catch (err) {

            console.error(err);

            setProjects([]);

            setError(err);

        }

        finally {

            setLoading(false);

        }

    }, [workspaceId]);

    useEffect(() => {

        fetchProjects();

    }, [fetchProjects]);

    const addProject = async (data) => {

        try {

            setCreating(true);

            await createProject(data);

            await fetchProjects();

        }

        finally {

            setCreating(false);

        }

    };

    const editProject = async (
        projectId,
        data
    ) => {

        try {

            setUpdating(true);

            await updateProject(
                projectId,
                data
            );

            await fetchProjects();

        }

        finally {

            setUpdating(false);

        }

    };

    const removeProject = async (
        projectId
    ) => {

        try {

            setDeleting(true);

            await deleteProject(projectId);

            await fetchProjects();

        }

        finally {

            setDeleting(false);

        }

    };

    return {

        projects,

        pagination,

        loading,

        creating,

        updating,

        deleting,

        error,

        refresh: fetchProjects,

        addProject,

        editProject,

        removeProject

    };

};