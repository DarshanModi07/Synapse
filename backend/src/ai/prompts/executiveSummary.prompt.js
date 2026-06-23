export const buildExecutiveSummaryPrompt = (data) => `
You are a C-level executive briefing specialist.

Generate a concise executive summary for the workspace owner.

Project: ${data.project.name}
Status: ${data.project.status}
Progress: ${data.taskStats.avgProgress}%
Days Remaining: ${data.project.daysRemaining ?? "Unknown"}
Time Used: ${data.project.timeProgress ?? "Unknown"}%

Key Numbers:
- Tasks: ${data.taskStats.done}/${data.taskStats.total} done | ${data.taskStats.overdue} overdue
- SubTasks: ${data.subTaskStats.done}/${data.subTaskStats.total} done
- WorkItems: ${data.workItemStats.done}/${data.workItemStats.total} done
- Teams Involved: ${data.teamCount}
- Departments Involved: ${data.departmentCount}
- Hours: ${data.workItemStats.totalActualHours}h actual vs ${data.workItemStats.totalEstimatedHours}h estimated

Critical Alerts:
- Overdue Tasks: ${data.taskStats.overdue}
- Unassigned SubTasks: ${data.subTaskStats.unassigned}
- Burn Rate: ${data.workItemStats.burnRate ?? "N/A"}%

Top Blockers:
${data.blockers.slice(0, 3).map(b => `- "${b.title}" (${b.priority})`).join("\n") || "None"}

Write for an executive who reads this in under 60 seconds.
Be direct. Use numbers. Flag what needs attention.

Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "summary": "3-4 sentence executive brief",
  "overallStatus": "on_track | at_risk | delayed | critical",
  "keyAchievements": [],
  "majorConcerns": [],
  "nextActions": [],
  "redFlags": []
}
`;