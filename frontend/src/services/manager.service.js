import api from "@/api/axios";

export const getManagerDepartments = async (workspaceId) => {
  const response = await api.get(`/manager/${workspaceId}/departments`);
  return response.data;
};

export const getAllManagerWorkspaceProjects = async (workspaceId) => {
  const response = await api.get(`/manager/${workspaceId}/projects`);
  return response.data;
};

export const getAllManagerWorkspaceTeams = async (workspaceId) => {
  const response = await api.get(`/manager/${workspaceId}/teams`);
  return response.data;
};

export const generateManagerProjectTasksAI = async (projectId, data) => {
  const response = await api.post(`/manager/projects/${projectId}/ai-tasks`, data);
  return response.data;
};

export const approveManagerProjectTasks = async (projectId, data) => {
  const response = await api.post(`/manager/projects/${projectId}/bulk-tasks`, data);
  return response.data;
};

export const getManagerDepartmentDashboard = async (departmentId) => {
  const response = await api.get(`/manager/departments/${departmentId}/dashboard`);
  return response.data;
};

// Manager Department Teams Methods
export const getManagerDepartmentTeams = async (departmentId) => {
  const response = await api.get(`/manager/departments/${departmentId}/teams`);
  return response.data;
};

export const suggestManagerTeams = async (departmentId) => {
  const response = await api.post(`/manager/departments/${departmentId}/teams/ai-suggest`);
  return response.data;
};

// Manager Team Methods
export const createManagerTeam = async (departmentId, data) => {
  const response = await api.post(`/manager/departments/${departmentId}/teams/create`, data);
  return response.data;
};

export const updateManagerTeam = async (teamId, data) => {
  const response = await api.patch(`/manager/teams/${teamId}/update`, data);
  return response.data;
};

export const deleteManagerTeam = async (teamId) => {
  const response = await api.delete(`/manager/teams/${teamId}/delete`);
  return response.data;
};

export const addManagerTeamMember = async (teamId, memberId) => {
  const response = await api.post(`/manager/teams/${teamId}/member/add`, { memberId });
  return response.data;
};

export const removeManagerTeamMember = async (teamId, memberId) => {
  const response = await api.delete(`/manager/teams/${teamId}/member/delete`, { data: { memberId } });
  return response.data;
};

export const getManagerTeamDashboard = async (teamId) => {
  const response = await api.get(`/manager/teams/${teamId}/dashboard`);
  return response.data;
};

export const getManagerAvailableLeaders = async (departmentId) => {
  const response = await api.get(`/manager/departments/${departmentId}/available-leaders`);
  return response.data;
};

export const getManagerProjectDashboard = async (projectId) => {
  const response = await api.get(`/manager/projects/${projectId}/dashboard`);
  return response.data;
};

