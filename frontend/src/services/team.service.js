import api from "@/api/axios";

/*
|--------------------------------------------------------------------------
| Get All Workspace Teams
|--------------------------------------------------------------------------
*/

export const getWorkspaceTeams = async (
  workspaceId,
  page = 1,
  limit = 20
) => {
  const response = await api.get(
    `/team/workspace/${workspaceId}?page=${page}&limit=${limit}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Team Dashboard
|--------------------------------------------------------------------------
*/

export const getTeamDashboard = async (
  teamId
) => {
  const response = await api.get(
    `/team/${teamId}/dashboard`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Team
|--------------------------------------------------------------------------
*/

export const createTeam = async (
  data
) => {
  const response = await api.post(
    "/team/createTeam",
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Team
|--------------------------------------------------------------------------
*/

export const updateTeam = async (
  teamId,
  data
) => {
  const response = await api.patch(
    `/team/${teamId}/update`,
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Team
|--------------------------------------------------------------------------
*/

export const deleteTeam = async (
  teamId
) => {
  const response = await api.delete(
    `/team/${teamId}/delete`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Available Team Leaders
|--------------------------------------------------------------------------
*/

export const getAvailableLeaders = async (
  departmentId
) => {
  const response = await api.get(
    `/team/department/${departmentId}/available-leaders`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| AI Team Suggestions
|--------------------------------------------------------------------------
*/

export const suggestTeams = async (
  departmentId
) => {
  const response = await api.post(
    "/ai/suggest-teams",
    {
      departmentId,
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Team Members
|--------------------------------------------------------------------------
*/

export const getTeamMembers = async (
  teamId
) => {
  const response = await api.get(
    `/team/${teamId}/members`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Add Team Member
|--------------------------------------------------------------------------
*/

export const addTeamMember = async (
  teamId,
  memberId
) => {
  const response = await api.post(
    `/team/${teamId}/members`,
    {
      memberId,
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Remove Team Member
|--------------------------------------------------------------------------
*/

export const removeTeamMember = async (
  teamId,
  memberId
) => {
  const response = await api.delete(
    `/team/${teamId}/members/${memberId}`
  );

  return response.data;
};