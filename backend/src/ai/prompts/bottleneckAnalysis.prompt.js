export const buildBottleneckAnalysisPrompt = (data) => `
You are a bottleneck detection specialist.

Identify all bottlenecks in the following project.

Project: ${data.project.name}

Stuck Tasks (overdue or high priority, not done):
${data.blockers.length
    ? data.blockers.map(b =>
        `- "${b.title}" | ${b.priority} priority | ${b.status} | ${b.daysOverdue > 0 ? `${b.daysOverdue} days overdue` : "not yet overdue"}`
    ).join("\n")
    : "None"
}

Team Bottlenecks:
${data.teamStats.map(t =>
    `- ${t.teamName}: ${t.tasks.overdue} overdue tasks | ${t.subtasks.unassigned} unassigned subtasks | ${t.memberCount} members for ${t.tasks.total} tasks`
).join("\n")}

Resource Bottlenecks:
- Overloaded Employees: ${data.employeeWorkload.filter(e => e.overdue > 2 || e.total > 7).map(e => e.name).join(", ") || "None"}
- Unassigned SubTasks: ${data.subTaskStats.unassigned}

Hour Bottlenecks:
- Burn Rate: ${data.workItemStats.burnRate ?? "N/A"}% (>120% indicates resource strain)

Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "bottlenecks": [
    {
      "title": "",
      "type": "task | subtask | team | resource | dependency",
      "severity": "low | medium | high | critical",
      "detail": "",
      "recommendation": ""
    }
  ],
  "overallSeverity": "low | medium | high | critical",
  "recommendations": []
}
`;