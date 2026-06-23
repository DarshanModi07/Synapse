export const buildProjectAnalysisPrompt = (data) => `
You are a senior project management analyst.

Analyze the following real project data and return a structured assessment.

Project: ${data.project.name}
Description: ${data.project.description ?? "Not provided"}
Status: ${data.project.status}
Progress: ${data.taskStats.avgProgress}%
Days Elapsed: ${data.project.daysElapsed ?? "Unknown"}
Days Remaining: ${data.project.daysRemaining ?? "Unknown"}
Time Progress: ${data.project.timeProgress ?? "Unknown"}%

Tasks: ${data.taskStats.total} total | ${data.taskStats.done} done | ${data.taskStats.in_progress} in progress | ${data.taskStats.overdue} overdue
SubTasks: ${data.subTaskStats.total} total | ${data.subTaskStats.done} done | ${data.subTaskStats.unassigned} unassigned
WorkItems: ${data.workItemStats.total} total | ${data.workItemStats.done} done
Hours: ${data.workItemStats.totalEstimatedHours}h estimated | ${data.workItemStats.totalActualHours}h actual
Departments: ${data.departmentCount}
Teams: ${data.teamCount}

Team Performance:
${data.teamStats.map(t =>
    `- ${t.teamName} (${t.departmentName}): ${t.tasks.done}/${t.tasks.total} tasks done, ${t.tasks.overdue} overdue, avg progress ${t.tasks.avgProgress}%`
).join("\n")}

Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "overallAssessment": "2-3 sentence project assessment",
  "completionRate": 0,
  "progressVsTimeGap": "ahead | on_track | behind | critical",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}
`;