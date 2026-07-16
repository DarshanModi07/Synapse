export const buildTeamLeadAnalyticsPrompt = (data) => {
    return `
You are an expert engineering leader and project management AI. You are given data for a Team Lead who oversees multiple teams, projects, and members.

Analyze the data and provide actionable leadership insights STRICTLY in the following JSON format. Do not include markdown codeblocks around the JSON. Provide only valid JSON.

Data:
${JSON.stringify(data, null, 2)}

Required JSON Format:
{
    "overloadedTeams": [ "TeamName1", "TeamName2" ],
    "underutilizedTeams": [ "TeamName3" ],
    "delayedTeams": [ "TeamName1" ],
    "topPerformers": [ "MemberName1", "MemberName2" ],
    "recommendations": [ "Recommendation 1", "Recommendation 2" ],
    "risks": [ "Risk 1", "Risk 2" ],
    "teamHealthScore": {
        "TeamName1": 85,
        "TeamName2": 68
    },
    "predictions": [
        "Engineering Team will likely miss the deadline by 3 days.",
        "Safety Team is expected to finish ahead of schedule."
    ]
}

Note:
- 'overloadedTeams': Teams with unusually high task counts or low completion rates compared to their size.
- 'underutilizedTeams': Teams with very few tasks or high completion rates indicating free capacity.
- 'delayedTeams': Teams with a significant number of overdue or delayed tasks.
- 'topPerformers': High performing members or teams based on completion rates and volume.
- 'recommendations': 2-3 actionable management suggestions (e.g., "Reassign work from X to Y").
- 'risks': 2-3 sentence points on critical risks (e.g., "Team X completion dropped by 12%").
- 'teamHealthScore': Provide a score from 0-100 for EACH team based on their productivity and workload. Key should be the team name.
- 'predictions': 2-4 AI-generated predictive insights about future performance, deadlines, or resource needs based on current velocity.
`;
};
