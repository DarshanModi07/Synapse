export const buildWorkloadAnalysisPrompt = (data) => `
You are a workforce analytics specialist.

Analyze the workload distribution across all team members.

Project: ${data.project.name}

Employee Workload Data:
${data.employeeWorkload.length
    ? data.employeeWorkload.map(e =>
        `- ${e.name}: ${e.total} subtasks assigned | ${e.done} done | ${e.inProgress} in progress | ${e.overdue} overdue`
    ).join("\n")
    : "No employees assigned yet"
}

Team Capacity:
${data.teamStats.map(t =>
    `- ${t.teamName} (${t.departmentName}): ${t.memberCount} members | ${t.tasks.total} tasks | ${t.subtasks.unassigned} unassigned subtasks`
).join("\n")}

Workload Classification:
- Overloaded: >7 active subtasks or >2 overdue
- Balanced: 3-7 active subtasks, 0-1 overdue
- Underutilized: <3 subtasks assigned

Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "overloadedMembers": [
    { "name": "", "subtaskCount": 0, "overdueCount": 0, "risk": "" }
  ],
  "balancedMembers": [
    { "name": "", "subtaskCount": 0 }
  ],
  "underutilizedMembers": [
    { "name": "", "subtaskCount": 0, "recommendation": "" }
  ],
  "recommendations": []
}
`;