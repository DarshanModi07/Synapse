import api from "@/api/axios";

/*
|--------------------------------------------------------------------------
| Project Dashboard
|--------------------------------------------------------------------------
*/

export const getProjectDashboard = async (
    projectId
) => {

    const response = await api.get(
        `/project/${projectId}/dashboard`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Available Departments
|--------------------------------------------------------------------------
*/

export const getAvailableDepartments = async (
    projectId
) => {

    const response = await api.get(
        `/project/${projectId}/available-departments`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Assign Department
|--------------------------------------------------------------------------
*/

export const assignDepartment = async (
    data
) => {

    const response = await api.post(
        `/project-department/${data.projectId}/department`,
        data
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Remove Department
|--------------------------------------------------------------------------
*/

export const removeDepartment = async (
    projectId,
    departmentId
) => {

    const response = await api.delete(
        `/project-department/project/${projectId}/department/${departmentId}`
    );

    return response.data;

};