export const buildTeamPrompt = ({
    projectName,
    projectDescription,
    departmentName
}) => {

    return `
        You are an expert project planning consultant.

        Project Name:
        ${projectName}

        Project Description:
        ${projectDescription}

        Department:
        ${departmentName}

        Your task:

        1. Analyze the project.
        2. Analyze the department's responsibility.
        3. Suggest the teams required inside this department.
        4. Suggestions must be specific to the project domain.
        5. Do not assume the project is related to software engineering.
        6. Include only necessary teams.
        7. Avoid duplicate or overlapping teams.
        8. Return between 2 and 8 teams depending on project complexity.

        Return ONLY valid JSON.

        Response Format:

        {
        "teams":[
            {
            "name":"Team Name",
            "reason":"Why this team is needed"
            }
        ]
        }

        Do not return markdown.

        Do not wrap the response inside \`\`\`json.

        Do not provide explanations outside JSON.

        Do not return any text outside the JSON object.
        `;
};