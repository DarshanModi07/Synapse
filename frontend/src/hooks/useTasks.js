import {
    useCallback,
    useEffect,
    useState
} from "react";

import {

    getTasks,

    createTask,

    updateTask,

    deleteTask

} from "@/services/task.service";

export const useTasks = (
    projectTeamId
) => {

    const [tasks, setTasks] =
        useState([]);

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

    /*
    =====================================================
    FETCH TASKS
    =====================================================
    */

    const fetchTasks =
        useCallback(async () => {

            if (!projectTeamId) {

                setTasks([]);

                setLoading(false);

                return;

            }

            try {

                setLoading(true);

                const response =
                    await getTasks(
                        projectTeamId
                    );

                setTasks(
                    response.data || []
                );

                setError(null);

            }
            catch (err) {

                console.error(err);

                setError(err);

            }
            finally {

                setLoading(false);

            }

        }, [projectTeamId]);

    useEffect(() => {

        fetchTasks();

    }, [fetchTasks]);

    /*
    =====================================================
    CREATE
    =====================================================
    */

    const addTask = async (
        data
    ) => {

        try {

            setCreating(true);

            await createTask(
                projectTeamId,
                data
            );

            await fetchTasks();

        }
        finally {

            setCreating(false);

        }

    };

    /*
    =====================================================
    UPDATE
    =====================================================
    */

    const editTask = async (
        taskId,
        data
    ) => {

        try {

            setUpdating(true);

            await updateTask(
                taskId,
                data
            );

            await fetchTasks();

        }
        finally {

            setUpdating(false);

        }

    };

    /*
    =====================================================
    DELETE
    =====================================================
    */

    const removeTask = async (
        taskId
    ) => {

        try {

            setDeleting(true);

            await deleteTask(
                taskId
            );

            await fetchTasks();

        }
        finally {

            setDeleting(false);

        }

    };

    return {

        tasks,

        loading,

        creating,

        updating,

        deleting,

        error,

        refresh:
            fetchTasks,

        addTask,

        editTask,

        removeTask

    };

};