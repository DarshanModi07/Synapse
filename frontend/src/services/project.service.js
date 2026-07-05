import api from "@/api/axios";

/*
|--------------------------------------------------------------------------
| Get All Projects
|--------------------------------------------------------------------------
*/

export const getAllProjects = async (
    workspaceId,
    page = 1,
    limit = 12
) => {

    const response = await api.get(
        `/project/${workspaceId}/getAllProjects?page=${page}&limit=${limit}`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Get Single Project
|--------------------------------------------------------------------------
*/

export const getProject = async (
    projectId
) => {

    const response = await api.get(
        `/project/${projectId}`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
*/

export const createProject = async (
    data
) => {

    const response = await api.post(
        "/project/createProject",
        data
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Update Project
|--------------------------------------------------------------------------
*/

export const updateProject = async (
    projectId,
    data
) => {

    const response = await api.patch(
        `/project/${projectId}/update`,
        data
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Delete Project
|--------------------------------------------------------------------------
*/

export const deleteProject = async (
    projectId
) => {

    const response = await api.delete(
        `/project/${projectId}/delete`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Project Progress
|--------------------------------------------------------------------------
*/

export const getProjectProgress = async (
    projectId
) => {

    const response = await api.get(
        `/project/${projectId}/progress`
    );

    return response.data;

};