import api from "@/api/axios";

/*
|--------------------------------------------------------------------------
| Get Tasks
|--------------------------------------------------------------------------
*/

export const getTasks = async (
    projectTeamId,
    page = 1,
    limit = 20
) => {

    const response = await api.get(
        `/project-team-task/${projectTeamId}/allTasks?page=${page}&limit=${limit}`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Create Task
|--------------------------------------------------------------------------
*/

export const createTask = async (
    projectTeamId,
    data
) => {

    const response = await api.post(
        `/project-team-task/${projectTeamId}/task`,
        data
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Update Task
|--------------------------------------------------------------------------
*/

export const updateTask = async (
    taskId,
    data
) => {

    const response = await api.patch(
        `/project-team-task/${taskId}/update`,
        data
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Delete Task
|--------------------------------------------------------------------------
*/

export const deleteTask = async (
    taskId
) => {

    const response = await api.delete(
        `/project-team-task/${taskId}/delete`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Task Progress
|--------------------------------------------------------------------------
*/

export const getTaskProgress = async (
    taskId
) => {

    const response = await api.get(
        `/project-team-task/${taskId}/progress`
    );

    return response.data;

};