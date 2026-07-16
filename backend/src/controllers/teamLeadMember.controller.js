import teamLeadMemberService from "../services/teamLeadMember.service.js";

export const getAllTeamLeadMembers = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        const result = await teamLeadMemberService.getAllTeamLeadMembers(userId);
        
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Error in getAllTeamLeadMembers:", error);
        return res.status(500).json({ message: "Internal server error fetching members." });
    }
};

export const getTeamLeadMemberDetails = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        const { memberId } = req.params;

        const result = await teamLeadMemberService.getTeamLeadMemberDetails(userId, memberId);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Error in getTeamLeadMemberDetails:", error);
        return res.status(500).json({ message: error.message || "Internal server error fetching member details." });
    }
};
