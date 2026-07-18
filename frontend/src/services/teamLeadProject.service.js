import api from "@/api/axios";

const teamLeadProjectService = {
  // Master list of projects across all teams
  getProjects: async () => {
    const response = await api.get("/team-lead/projects");
    return response.data.data;
  },

  // Project Command Center Payload
  getProjectDetails: async (projectId) => {
    const response = await api.get(`/team-lead/projects/${projectId}`);
    return response.data.data;
  },

  // SubTask Mutations
  createSubTask: async (taskId, data) => {
    const response = await api.post(`/team-lead/projects/task/${taskId}/subtasks`, data);
    return response.data.data;
  },
  updateSubTask: async (subTaskId, data) => {
    const response = await api.patch(`/team-lead/projects/subtask/${subTaskId}`, data);
    return response.data.data;
  },
  deleteSubTask: async (subTaskId) => {
    const response = await api.delete(`/team-lead/projects/subtask/${subTaskId}`);
    return response.data;
  },

  // WorkItem Mutations
  createWorkItem: async (subTaskId, data) => {
    const response = await api.post(`/team-lead/projects/subtask/${subTaskId}/workitems`, data);
    return response.data.data;
  },
  updateWorkItem: async (workItemId, data) => {
    const response = await api.patch(`/team-lead/projects/workitem/${workItemId}`, data);
    return response.data.data;
  },
  deleteWorkItem: async (workItemId) => {
    const response = await api.delete(`/team-lead/projects/workitem/${workItemId}`);
    return response.data;
  },

  // AI Generators
  generateSubTasksAI: async (taskId) => {
    const response = await api.post(`/team-lead/projects/task/${taskId}/ai/subtasks`);
    return response.data.data; // Expected { subtasks: [...] }
  },
  generateWorkItemsAI: async (subTaskId) => {
    const response = await api.post(`/team-lead/projects/subtask/${subTaskId}/ai/workitems`);
    return response.data.data; // Expected { workItems: [...] }
  },

  // Review Endpoints
  approveSubTask: async (subTaskId) => {
    const response = await api.post(`/team-lead/projects/subtask/${subTaskId}/approve`);
    return response.data.data;
  },
  rejectSubTask: async (subTaskId, data) => {
    const response = await api.post(`/team-lead/projects/subtask/${subTaskId}/reject`, data);
    return response.data.data;
  }
};

export default teamLeadProjectService;
