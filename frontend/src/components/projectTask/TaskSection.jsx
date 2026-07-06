import { useState } from "react";

import { Plus } from "lucide-react";

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

                        <h2

                            className="text-2xl font-semibold"

                            style={{

                                color: theme.text

                            }}

                        >

                            Tasks

                        </h2>

                        <p

                            className="mt-1"

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Create, edit and manage project tasks.

                        </p>

                    </div>

                    <button

                        onClick={() =>

                            setCreateOpen(true)

                        }

                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500"

                    >

                        <Plus size={18} />

                        Create Task

                    </button>

                </div>

                {/* Task Grid */}

                <TaskGrid

                    tasks={tasks}

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