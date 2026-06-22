export const buildWorkItemPrompt = ({
    subtaskTitle,
    subtaskDescription
}) => {

    return `
        You are an expert technical task planner.

        Subtask Title:
        ${subtaskTitle}

        Subtask Description:
        ${subtaskDescription}

        Your tasks:

        1. Analyze the subtask description carefully.
        2. Break the subtask into granular work items.
        3. Each work item must be a single concrete unit of work.
        4. Estimate hours required for each work item.
        5. Avoid duplicate or overlapping work items.
        6. Return between 2 and 6 work items depending on subtask complexity.

        Return ONLY valid JSON.

        Response Format:

        {
        "workItems": [
            {
            "title": "Work Item Title",
            "description": "Work Item Description",
            "estimatedHours": 0,
            "priority": "low | medium | high | urgent"
            }
        ]
        }

        Do not return markdown.
        Do not wrap the response in \`\`\`json.
        Do not provide explanations outside the JSON.
    `;
};