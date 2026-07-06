import api from "@/api/axios";

/*
|--------------------------------------------------------------------------
| Project Team Dashboard
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