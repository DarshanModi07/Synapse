export const buildSubTaskPrompt = ({
    taskTitle,
    taskDescription,
    teamMembers
}) => {

    const memberList = teamMembers
        .map(m => `- ${m.name} (id: ${m.id}, role: ${m.work_role})`)
        .join("\n");

    return `
        You are an expert engineering project manager.

        Task Title:
        ${taskTitle}

        Task Description:
        ${taskDescription}

        Available Team Members:
        ${memberList}

        Your tasks:

        1. Analyze the task description carefully.
        2. Break the task into smaller actionable subtasks.
        3. Each subtask must be independently completable.
        4. Suggest which team member is best suited for each subtask based on their role.
        5. Do not assign the same subtask to multiple members.
        6. Avoid duplicate or overlapping subtasks.
        7. Return between 2 and 8 subtasks depending on task complexity.
        8. Only use member ids from the provided list for suggestedAssigneeId.
        9. If no member is suitable, set suggestedAssigneeId to null.

        Return ONLY valid JSON.

        Response Format:

        {
        "subtasks": [
            {
            "title": "Subtask Title",
            "description": "Subtask Description",
            "assignedToId": "member id or null",
            "reason": "Why this member or why null"
            }
        ]
        }

        Do not return markdown.
        Do not wrap the response in \`\`\`json.
        Do not provide explanations outside the JSON.
    `;
};