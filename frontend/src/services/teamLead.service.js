import api from "@/api/axios";

const teamLeadService = {
  getDashboardData: async () => {
    const response = await api.get("/team-lead/dashboard");
    return response.data.data;
  },
  getProjects: async () => {
    const response = await api.get("/team-lead/projects");
    return response.data.data;
  },
  getMembers: async () => {
    const response = await api.get("/team-lead/members");
    return response.data.data;
  },
  getAnalytics: async () => {
    const response = await api.get("/team-lead/analytics");
    return response.data.data;
  },
};

export default teamLeadService;
