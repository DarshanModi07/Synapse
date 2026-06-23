export const buildDeadlinePredictionPrompt = (data) => `
You are an expert project delivery forecaster.

Predict whether this project will meet its deadline based on current data.

Project: ${data.project.name}
Official Due Date: ${data.project.dueDate ?? "Not set"}
Days Remaining: ${data.project.daysRemaining ?? "Unknown"}
Days Elapsed: ${data.project.daysElapsed ?? "Unknown"}

Progress Metrics:
- Task Progress: ${data.taskStats.avgProgress}%
- Time Elapsed: ${data.project.timeProgress ?? "Unknown"}%
- Velocity: ${data.project.velocity ?? "Unknown"} % progress per day
- Tasks Done: ${data.taskStats.done}/${data.taskStats.total}
- SubTasks Done: ${data.subTaskStats.done}/${data.subTaskStats.total}
- WorkItems Done: ${data.workItemStats.done}/${data.workItemStats.total}

Delay Signals:
- Overdue Tasks: ${data.taskStats.overdue}
- Overdue SubTasks: ${data.subTaskStats.overdue}
- Burn Rate: ${data.workItemStats.burnRate ?? "N/A"}%

If velocity > 0 and days remaining > 0, estimate completion date mathematically:
remaining progress = 100 - ${data.taskStats.avgProgress}
days needed = remaining progress / velocity
estimated date = today + days needed

Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "predictedCompletionDate": "YYYY-MM-DD or null",
  "confidence": 0,
  "isLikelyToMissDeadline": false,
  "delayEstimateDays": 0,
  "reasoning": ["reason 1", "reason 2", "reason 3"]
}
`;