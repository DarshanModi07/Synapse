export const buildTaskPrompt = ({
    projectName,
    projectDescription,
    departmentName,
    teamName,
    teamMembers
}) => {

    const memberList = teamMembers
        .map(m => `- ${m.name} (work_role: ${m.work_role})`)
        .join("\n");

    return `
        You are an expert project planning consultant.

        Project Name:
        ${projectName}

        Project Description:
        ${projectDescription}

        Department:
        ${departmentName}

        Team:
        ${teamName}

        Team Members:
        ${memberList}

        Your tasks:

        1. Analyze the project and the team's responsibility within it.
        2. Suggest actionable tasks this team should complete for the project.
        3. Each task must be specific to the team's domain and project scope.
        4. Do not suggest tasks that belong to other departments or teams.
        5. Avoid duplicate or overlapping tasks.
        6. Return between 3 and 8 tasks depending on project complexity.
        7. Assign a priority (low, medium, high, urgent) to each task.

        Return ONLY valid JSON.

        Response Format:

        {
        "tasks": [
            {
            "title": "Task Title",
            "description": "Task Description",
            "priority": "low | medium | high | urgent"
            }
        ]
        }

        Do not return markdown.
        Do not wrap the response in \`\`\`json.
        Do not provide explanations outside the JSON.
    `;
};