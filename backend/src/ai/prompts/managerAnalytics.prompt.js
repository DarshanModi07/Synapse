export const buildManagerAnalyticsPrompt = (data) => {
    return `
You are an expert project management AI. You are given data for a manager who oversees specific departments, teams, projects, and tasks.

Analyze the data and provide insights strictly in the following JSON format. Do not include markdown codeblocks around the JSON. Provide only valid JSON.

Data:
${JSON.stringify(data, null, 2)}

Required JSON Format:
{
    "overloadedTeams": [ "teamName1", "teamName2" ],
    "underutilizedTeams": [ "teamName3" ],
    "delayedProjects": [ "projectName1" ],
    "topEmployees": [ "employeeName1" ],
    "suggestedAssignments": [ "Assign Team X to Project Y" ],
    "riskAnalysis": [ "Risk 1", "Risk 2" ],
    "departmentHealthScore": 85
}

Note:
- 'overloadedTeams': Teams with a high task/subtask count.
- 'underutilizedTeams': Teams with very few tasks/projects.
- 'delayedProjects': Projects that seem delayed based on status or due date.
- 'topEmployees': Not explicitly in data unless inferred, you can leave empty if no employee data is provided.
- 'suggestedAssignments': Practical actionable suggestions based on workloads.
- 'riskAnalysis': 2-3 sentence points on risks.
- 'departmentHealthScore': 0-100 score based on completion rate and workload balance.
`;
};
