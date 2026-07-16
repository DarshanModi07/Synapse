import api from "@/api/axios";

class TeamLeadMemberService {
    /**
     * Fetch all members across teams led by the team lead
     */
    async getAllMembers() {
        try {
            const response = await api.get('/team-lead/members');
            return response.data;
        } catch (error) {
            console.error("Error fetching team lead members:", error);
            throw error;
        }
    }

    /**
     * Fetch detailed profile and analytics for a specific member
     * @param {string} memberId 
     */
    async getMemberDetails(memberId) {
        try {
            const response = await api.get(`/team-lead/members/${memberId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching details for member ${memberId}:`, error);
            throw error;
        }
    }
}

export default new TeamLeadMemberService();
