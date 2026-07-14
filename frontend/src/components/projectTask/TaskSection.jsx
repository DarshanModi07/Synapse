import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";

import { theme } from "@/lib/theme";

import { useTasks } from "@/hooks/useTasks";

import TaskGrid from "./TaskGrid";

import CreateTaskModal from "./CreateTaskModal";

import EditTaskModal from "./EditTaskModal";

import DeleteTaskDialog from "./DeleteTaskDialog";

const TaskSection = ({

    projectTeamId

}) => {

    /*
    =====================================================
    HOOK
    =====================================================
    */

    const {

        tasks,

        loading,

        creating,

        updating,

        deleting,

        addTask,

        editTask,

        removeTask

    } = useTasks(projectTeamId);

    /*
    =====================================================
    MODALS
    =====================================================
    */

    const [createOpen, setCreateOpen] =
        useState(false);

    const [editOpen, setEditOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedTask, setSelectedTask] =
        useState(null);

    /*
    =====================================================
    CREATE
    =====================================================
    */

    const handleCreate = async (
        data
    ) => {

        await addTask(data);

        setCreateOpen(false);

    };

    /*
    =====================================================
    EDIT
    =====================================================
    */

    const handleEdit = async (
        taskId,
        data
    ) => {

        await editTask(
            taskId,
            data
        );

        setEditOpen(false);

        setSelectedTask(null);

    };

    /*
    =====================================================
    DELETE
    =====================================================
    */

    const handleDelete = async (
        taskId
    ) => {

        await removeTask(taskId);

        setDeleteOpen(false);

        setSelectedTask(null);

    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredTasks = useMemo(() => {
        if (!searchQuery.trim()) return tasks;
        const q = searchQuery.toLowerCase();
        return tasks.filter(t => 
            t.title.toLowerCase().includes(q) || 
            (t.description && t.description.toLowerCase().includes(q))
        );
    }, [tasks, searchQuery]);

    /*
    =====================================================
    UI
    =====================================================
    */

    return (

        <>

            <section className="space-y-6">

                {/* Header */}

                <div className="flex items-center justify-between">

                    <div>
                        <h2 className="text-[22px] font-semibold text-zinc-100 flex items-center gap-3">
                            Tasks 
                            <span className="text-sm font-medium bg-zinc-800/80 text-zinc-400 px-2.5 py-0.5 rounded-full">
                                {filteredTasks.length}
                            </span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors" size={16} />
                            <input 
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 w-64 transition-all placeholder:text-zinc-600"
                            />
                        </div>

                        <button
                            onClick={() => setCreateOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 font-medium text-white transition hover:bg-violet-500"
                        >
                            <Plus size={18} />
                            Create Task
                        </button>
                    </div>

                </div>

                {/* Task Grid */}

                <TaskGrid

                    tasks={filteredTasks}

                    loading={loading}

                    onEdit={(task) => {

                        setSelectedTask(task);

                        setEditOpen(true);

                    }}

                    onDelete={(task) => {

                        setSelectedTask(task);

                        setDeleteOpen(true);

                    }}

                />

            </section>

                        {/* Create Task */}

            <CreateTaskModal

                open={createOpen}

                loading={creating}

                onClose={() =>

                    setCreateOpen(false)

                }

                onCreate={handleCreate}

            />

            {/* Edit Task */}

            <EditTaskModal

                open={editOpen}

                task={selectedTask}

                loading={updating}

                onClose={() => {

                    setEditOpen(false);

                    setSelectedTask(null);

                }}

                onUpdate={handleEdit}

            />

            {/* Delete Task */}

            <DeleteTaskDialog

                open={deleteOpen}

                task={selectedTask}

                loading={deleting}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedTask(null);

                }}

                onDelete={handleDelete}

            />

        </>

    );

};

export default TaskSection;