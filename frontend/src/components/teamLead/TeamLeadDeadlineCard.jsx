import { Clock, AlertTriangle, Calendar } from "lucide-react";
import { theme } from "@/lib/theme";

const TeamLeadDeadlineCard = ({ subtasks }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const activeSubtasks = (subtasks || []).filter(
    (s) => s.status !== "done" && s.status !== "cancelled" && s.dueDate
  );

  const dueToday = activeSubtasks.filter((s) => {
    const due = new Date(s.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  });

  const dueTomorrow = activeSubtasks.filter((s) => {
    const due = new Date(s.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === tomorrow.getTime();
  });

  const overdue = activeSubtasks.filter((s) => {
    const due = new Date(s.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime();
  });

  return (
    <div
      className="rounded-2xl border p-6 h-full"
      style={{
        background: theme.card,
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Upcoming Deadlines</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
          <Calendar className="h-5 w-5 text-purple-400" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Overdue */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 transition-all hover:bg-red-500/10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/20">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="font-semibold text-white">Overdue</p>
              <p className="text-sm text-red-400">
                {overdue.length} subtask{overdue.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Due Today */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 transition-all hover:bg-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-white">Due Today</p>
              <p className="text-sm text-amber-400">
                {dueToday.length} subtask{dueToday.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Due Tomorrow */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 transition-all hover:bg-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-white">Due Tomorrow</p>
              <p className="text-sm text-blue-400">
                {dueTomorrow.length} subtask{dueTomorrow.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLeadDeadlineCard;
