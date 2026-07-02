export const buildTeamPrompt = ({
    workspaceName,
    departmentName,
    existingTeams = []
}) => {

    return `
You are an expert organizational consultant.

Workspace:
${workspaceName}

Department:
${departmentName}

Existing Teams:
${existingTeams.length
        ? existingTeams.map(team => `- ${team}`).join("\n")
        : "None"}

Your task:

1. Analyze the department.
2. Suggest teams that should exist inside this department.
3. Consider industry best practices.
4. Avoid suggesting any team that already exists.
5. Do not generate duplicate or overlapping teams.
6. Generate between 3 and 8 teams depending on the department.
7. Team names should be concise and professional.
8. Each team should have a one-line description.

Return ONLY valid JSON.

Response Format:

{
    "teams": [
        {
            "name": "Frontend",
            "description": "Develops and maintains client-side applications."
        }
    ]
}

Do not return markdown.

Do not wrap the response in \`\`\`json.

Do not include any explanation outside the JSON.
`;
};