export const buildEmployeeAnalyticsPrompt = (data) => {
    return `
You are an expert AI productivity coach analyzing the performance of a single employee in a project management system.

Analyze the data and provide personal insights STRICTLY in the following JSON format. Do not include markdown codeblocks around the JSON. Provide only valid JSON.

Data:
${JSON.stringify(data, null, 2)}

Required JSON Format:
{
    "insights": [
        "You are completing tasks 18% faster than average.",
        "Consider prioritizing overdue work items.",
        "Your productivity is highest during weekdays.",
        "You have maintained a 90% completion rate for 3 weeks."
    ],
    "strengths": [ "Strength 1", "Strength 2" ],
    "areasForImprovement": [ "Area 1", "Area 2" ]
}

Note:
- 'insights': 4-5 bullet-point style observations about their productivity, delays, completion time, and work patterns.
- 'strengths': 2 short points on what they are doing well based on the data.
- 'areasForImprovement': 2 short points on what they can improve (e.g. closing overdue tasks).
- Remember to speak directly to the user (use "You", "Your").
`;
};
