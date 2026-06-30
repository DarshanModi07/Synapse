import api from "@/api/axios";

export const getUserWorkspaces = async (page = 1, limit = 10) => {
  const response = await api.get(
    `/workspace/getUserWorkSpaces?page=${page}&limit=${limit}`
  );

  return response.data;
};

export const createWorkspace = async (workspaceData) => {
  const response = await api.post(
    "/workspace/createWorkspace",
    workspaceData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getWorkspace = async (slug) => {
  const response = await api.get(`/workspace/${slug}`);

  return response.data;
};

export const getOwnerDashboard = async (workspaceId) => {
  const response = await api.get(
    `/workspace/${workspaceId}/dashboard`
  );

  return response.data;
};