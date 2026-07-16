import api from "@/api/axios";

class TeamLeadAnalyticsService {
    async getAnalytics() {
        try {
            const response = await api.get('/team-lead/analytics');
            return response.data;
        } catch (error) {
            console.error("Error fetching team lead analytics:", error);
            throw error;
        }
    }
}

export default new TeamLeadAnalyticsService();
