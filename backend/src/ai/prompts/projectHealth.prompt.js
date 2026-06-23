export const buildProjectHealthPrompt = (data) => `
You are a senior project health analyst.

Analyze the following project data and return a health score and assessment.

Project: ${data.project.name}
Status: ${data.project.status}
Overall Progress: ${data.taskStats.avgProgress}%
Time Progress: ${data.project.timeProgress ?? "Unknown"}%
Days Remaining: ${data.project.daysRemaining ?? "Unknown"}
Velocity: ${data.project.velocity ?? "Unknown"} % per day

Task Health:
- Total: ${data.taskStats.total}
- Done: ${data.taskStats.done}
- Overdue: ${data.taskStats.overdue}
- High Priority Pending: ${data.taskStats.high_priority}

SubTask Health:
- Unassigned: ${data.subTaskStats.unassigned}
- Overdue: ${data.subTaskStats.overdue}

WorkItem Health:
- Burn Rate: ${data.workItemStats.burnRate ?? "N/A"}% (>100 means over-budget on hours)
- Estimated: ${data.workItemStats.totalEstimatedHours}h
- Actual: ${data.workItemStats.totalActualHours}h

Team Distribution:
${data.teamStats.map(t =>
    `- ${t.teamName}: ${t.memberCount} members, ${t.tasks.overdue} overdue tasks`
).join("\n")}

Health Score Rules:
- Start at 100
- Deduct for overdue tasks, low progress vs time, high burn rate, unassigned subtasks
- Score 80-100 = healthy, 60-79 = warning, 40-59 = at risk, 0-39 = critical

Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "healthScore": 0,
  "status": "healthy | warning | at_risk | critical",
  "strengths": [],
  "concerns": [],
  "recommendedActions": []
}
`;