export const buildDepartmentPrompt = (workspaceName, workspaceDescription) => {

    return `
        You are an expert organizational planning consultant.

        Workspace Name:
        ${workspaceName}

        Workspace Description:
        ${workspaceDescription}

        Your tasks:

        1. Analyze the workspace description carefully.
        2. Identify the most likely organization domain.
        3. Suggest the departments required to successfully run this organization.
        4. Suggestions must be specific to the detected domain.
        5. Do not assume the organization belongs to software engineering.
        6. Include only departments that are truly necessary.
        7. Avoid duplicate or overlapping departments.
        8. Return between 3 and 10 departments depending on organization complexity.

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