export const buildReviewPrompt = ({
    subtaskTitle,
    subtaskDescription,
    workItems
}) => {

    const itemList = workItems
        .map(w => `- ${w.title} | status: ${w.status} | actualHours: ${w.actualHours ?? "not set"}`)
        .join("\n");

    return `
        You are an expert technical reviewer.

        Subtask Title:
        ${subtaskTitle}

        Subtask Description:
        ${subtaskDescription}

        Work Items Submitted:
        ${itemList}

        Your tasks:

        1. Analyze whether the completed work items fulfill the subtask description.
        2. Identify any gaps between what was described and what was actually done.
        3. Give a recommendation on whether this subtask should be approved or rejected.
        4. Keep the summary concise and factual.

        Return ONLY valid JSON.

        Response Format:

        {
        "recommendation": "approve or reject",
        "summary": "Short summary of what was completed",
        "gaps": ["List of missing or incomplete items, empty array if none"]
        }

        Do not return markdown.
        Do not wrap the response in \`\`\`json.
        Do not provide explanations outside the JSON.
    `;
};