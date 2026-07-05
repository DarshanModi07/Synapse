import api from "@/api/axios";

/*
|--------------------------------------------------------------------------
| Get Project Teams
|--------------------------------------------------------------------------
*/

export const getProjectTeams = async (
    projectDepartmentId,
    page = 1,
    limit = 20
) => {

    const response = await api.get(
        `/project-team/${projectDepartmentId}/teams?page=${page}&limit=${limit}`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Assign Team
|--------------------------------------------------------------------------
*/

export const assignTeam = async (
    projectDepartmentId,
    teamId
) => {

    const response = await api.post(
        `/project-team/${projectDepartmentId}/team`,
        {
            teamId
        }
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Remove Team
|--------------------------------------------------------------------------
*/

export const removeTeam = async (
    projectDepartmentId,
    teamId
) => {

    const response = await api.delete(
        `/project-team/${projectDepartmentId}/team/${teamId}`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Team Dashboard
|--------------------------------------------------------------------------
*/

export const getProjectTeamDashboard = async (
    projectTeamId
) => {

    const response = await api.get(
        `/project-team/${projectTeamId}/dashboard`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Available Teams
|--------------------------------------------------------------------------
*/

export const getAvailableTeams = async (
    projectDepartmentId
) => {

    const response = await api.get(
        `/project-team/${projectDepartmentId}/available-teams`
    );

    return response.data;

};