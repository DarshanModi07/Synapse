export const buildProductivityAnalysisPrompt = (data) => `
You are a productivity analytics specialist.

Analyze productivity across departments, teams, and employees.

Project: ${data.project.name}

Department & Team Productivity:
${data.teamStats.map(t => `
Team: ${t.teamName} | Department: ${t.departmentName} | Lead: ${t.leadName}
- Members: ${t.memberCount}
- Tasks Done: ${t.tasks.done}/${t.tasks.total} (${t.tasks.avgProgress}% avg progress)
- Overdue Tasks: ${t.tasks.overdue}
- SubTasks Done: ${t.subtasks.done}/${t.subtasks.total}
- Hours: ${t.hours.estimated}h estimated / ${t.hours.actual}h actual`
).join("\n")}

Employee Productivity:
${data.employeeWorkload.length
    ? data.employeeWorkload.map(e => {
        const completionRate = e.total > 0 ? Math.round((e.done / e.total) * 100) : 0;
        return `- ${e.name}: ${e.total} subtasks | ${completionRate}% completion rate | ${e.overdue} overdue`;
    }).join("\n")
    : "No employee data available"
}

Productivity Score = (done / total) * 100, penalized by overdue count.

Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "topPerformers": [
    { "name": "", "type": "team | employee", "completionRate": 0, "reason": "" }
  ],
  "lowestPerformers": [
    { "name": "", "type": "team | employee", "completionRate": 0, "reason": "" }
  ],
  "observations": [],
  "recommendations": []
}
`;