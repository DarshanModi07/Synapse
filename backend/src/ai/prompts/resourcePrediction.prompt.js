export const buildResourcePredictionPrompt = (data) => `
You are a resource planning specialist.

Determine whether additional resources are needed based on current project data.

Project: ${data.project.name}
Days Remaining: ${data.project.daysRemaining ?? "Unknown"}
Overall Progress: ${data.taskStats.avgProgress}%
Velocity: ${data.project.velocity ?? "Unknown"} % per day

Current Resources:
- Departments: ${data.departmentCount}
- Teams: ${data.teamCount}
- Total Assigned Employees: ${data.employeeWorkload.length}

Workload Pressure:
- Overdue Tasks: ${data.taskStats.overdue}
- Unassigned SubTasks: ${data.subTaskStats.unassigned}
- Overloaded Employees: ${data.employeeWorkload.filter(e => e.overdue > 2 || e.total > 7).length}

Hours Pressure:
- Estimated: ${data.workItemStats.totalEstimatedHours}h
- Actual so far: ${data.workItemStats.totalActualHours}h
- Burn Rate: ${data.workItemStats.burnRate ?? "N/A"}%

Team-level Signals:
${data.teamStats.map(t =>
    `- ${t.teamName}: ${t.memberCount} members carrying ${t.tasks.total} tasks (${t.tasks.overdue} overdue)`
).join("\n")}

Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "additionalResourcesNeeded": 0,
  "recommendedRoles": [],
  "teamsNeedingSupport": [],
  "reason": "",
  "impactIfNotAdded": "",
  "urgency": "low | medium | high | critical"
}
`;