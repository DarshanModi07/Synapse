export const validateAddMembers = (teamId, memberIds) => {
    if (!teamId) {
        throw new Error("Team ID is required.");
    }
    
    if (!memberIds || !Array.isArray(memberIds)) {
        throw new Error("memberIds must be an array.");
    }
    
    if (memberIds.length === 0) {
        throw new Error("At least one member must be selected.");
    }
    
    if (memberIds.length > 25) {
        throw new Error("Cannot add more than 25 members at once.");
    }
    
    const uniqueIds = new Set(memberIds);
    if (uniqueIds.size !== memberIds.length) {
        throw new Error("Duplicate member IDs provided in request.");
    }
    
    return true;
};
