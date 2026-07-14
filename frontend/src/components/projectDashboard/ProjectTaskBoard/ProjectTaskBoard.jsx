import { useState } from "react";
import { Plus } from "lucide-react";
import TaskCard from "@/components/projectTask/TaskCard";
import CreateTaskModal from "@/components/projectTask/CreateTaskModal";
import EditTaskModal from "@/components/projectTask/EditTaskModal";
import DeleteTaskDialog from "@/components/projectTask/DeleteTaskDialog";

const ProjectTaskBoard = ({ 
    tasks = [], 
    teams = [],
    onTaskCreate,
    onTaskEdit,
    onTaskDelete,
    onTaskStatusChange
}) => {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Group tasks by status
    const groupedTasks = {
        todo: tasks.filter(t => t.status === "todo"),
        in_progress: tasks.filter(t => t.status === "in_progress"),
        in_review: tasks.filter(t => t.status === "in_review"),
        blocked: tasks.filter(t => t.status === "blocked"),
        done: tasks.filter(t => t.status === "done")
    };

    const columns = [
        { id: "todo", title: "Todo", tasks: groupedTasks.todo, color: "border-zinc-800" },
        { id: "in_progress", title: "In Progress", tasks: groupedTasks.in_progress, color: "border-blue-900/30" },
        { id: "in_review", title: "In Review", tasks: groupedTasks.in_review, color: "border-amber-900/30" },
        { id: "blocked", title: "Blocked", tasks: groupedTasks.blocked, color: "border-red-900/30" },
        { id: "done", title: "Completed", tasks: groupedTasks.done, color: "border-green-900/30" }
    ];

    const handleCreateSubmit = async (data) => {
        setLoading(true);
        try {
            await onTaskCreate(data);
            setCreateOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async (data) => {
        if (!selectedTask) return;
        setLoading(true);
        try {
            await onTaskEdit(selectedTask.id, data);
            setEditOpen(false);
            setSelectedTask(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubmit = async () => {
        if (!selectedTask) return;
        setLoading(true);
        try {
            await onTaskDelete(selectedTask.id);
            setDeleteOpen(false);
            setSelectedTask(null);
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (task) => {
        setSelectedTask(task);
        setEditOpen(true);
    };

    const openDelete = (task) => {
        setSelectedTask(task);
        setDeleteOpen(true);
    };

    return (
        <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-white">Task Board</h2>
                <button
                    onClick={() => setCreateOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                >
                    <Plus size={16} />
                    New Task
                </button>
            </div>
            
            <div className="flex flex-col space-y-10 pb-8 mt-6">
                {columns.map(col => col.tasks.length > 0 && (
                    <div key={col.id} className="flex flex-col">
                        <div className="mb-4 flex items-center gap-3 border-b border-zinc-800/60 pb-3">
                            <h3 className="text-lg font-medium text-zinc-200">
                                {col.title}
                            </h3>
                            <span className="rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-xs font-semibold text-zinc-400">
                                {col.tasks.length}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {col.tasks.map(task => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    onEdit={() => openEdit(task)}
                                    onDelete={() => openDelete(task)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
                        No tasks in this project yet.
                    </div>
                )}
            </div>

            <CreateTaskModal
                open={createOpen}
                loading={loading}
                teams={teams}
                onClose={() => setCreateOpen(false)}
                onCreate={handleCreateSubmit}
            />

            {selectedTask && (
                <EditTaskModal
                    open={editOpen}
                    loading={loading}
                    task={selectedTask}
                    onClose={() => {
                        setEditOpen(false);
                        setSelectedTask(null);
                    }}
                    onUpdate={handleEditSubmit}
                />
            )}

            {selectedTask && (
                <DeleteTaskDialog
                    open={deleteOpen}
                    loading={loading}
                    onClose={() => {
                        setDeleteOpen(false);
                        setSelectedTask(null);
                    }}
                    onConfirm={handleDeleteSubmit}
                />
            )}
        </div>
    );
};

export default ProjectTaskBoard;
