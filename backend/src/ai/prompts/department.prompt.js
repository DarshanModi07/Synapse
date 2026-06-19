export const buildDepartmentPrompt = (projectName,description) => {

    return `
        You are an expert project planning consultant.

        Project Name:
        ${projectName}

        Project Description:
        ${description}

        Your tasks:

        1. Analyze the project description carefully.
        2. Identify the most likely project domain.
        3. Suggest the departments required to successfully execute the project.
        4. Suggestions must be specific to the detected domain.
        5. Do not assume the project belongs to software engineering.
        6. Include only departments that are truly necessary.
        7. Avoid duplicate or overlapping departments.
        8. Return between 3 and 10 departments depending on project complexity.

        Return ONLY valid JSON.

        Response Format:

        {
        "domain": "Detected Domain",
        "departments": [
            {
            "name": "Department Name",
            "reason": "Why this department is needed"
            }
        ]
        }

        Do not return markdown.
        Do not wrap the response in \`\`\`json.
        Do not provide explanations outside the JSON.
    `;
};