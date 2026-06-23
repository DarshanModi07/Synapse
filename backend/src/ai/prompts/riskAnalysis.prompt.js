export const buildRiskAnalysisPrompt = (data) => `
You are a senior project risk analyst.

Analyze the following project data and identify all risks.

Project: ${data.project.name}
Status: ${data.project.status}
Days Remaining: ${data.project.daysRemaining ?? "Unknown"}
Overall Progress: ${data.taskStats.avgProgress}%
Time Progress: ${data.project.timeProgress ?? "Unknown"}%

Critical Indicators:
- Overdue Tasks: ${data.taskStats.overdue}
- Overdue SubTasks: ${data.subTaskStats.overdue}
- Unassigned SubTasks: ${data.subTaskStats.unassigned}
- Burn Rate: ${data.workItemStats.burnRate ?? "N/A"}%
- High Priority Incomplete: ${data.taskStats.high_priority}

Top Blockers:
${data.blockers.length
    ? data.blockers.map(b =>
        `- "${b.title}" | ${b.priority} priority | ${b.daysOverdue > 0 ? `${b.daysOverdue} days overdue` : "not yet overdue"}`
    ).join("\n")
    : "None detected"
}

Team Risk Signals:
${data.teamStats.map(t =>
    `- ${t.teamName}: ${t.tasks.overdue} overdue, ${t.subtasks.unassigned} unassigned subtasks, ${t.memberCount} members`
).join("\n")}

Employee Overload Signals:
${data.employeeWorkload
    .filter(e => e.overdue > 0 || e.total > 5)
    .map(e => `- ${e.name}: ${e.total} subtasks, ${e.overdue} overdue`)
    .join("\n") || "No overload signals detected"
}

Risk Severity Levels: low | medium | high | critical

Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "riskLevel": "low | medium | high | critical",
  "risks": [
    {
      "title": "",
      "category": "schedule | delivery | resource | dependency | team",
      "severity": "low | medium | high | critical",
      "reason": "",
      "mitigation": ""
    }
  ]
}
`;