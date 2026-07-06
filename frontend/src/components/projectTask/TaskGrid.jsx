import TaskCard from "./TaskCard";

const TaskGrid = ({

    tasks,

    loading,

    onEdit,

    onDelete

}) => {

    /*
    =====================================================
    LOADING
    =====================================================
    */

    if (loading) {

        return (

            <div className="rounded-3xl border border-zinc-800 p-12 text-center text-zinc-400">

                Loading Tasks...

            </div>

        );

    }

    /*
    =====================================================
    EMPTY
    =====================================================
    */

    if (tasks.length === 0) {

        return (

            <div className="rounded-3xl border border-zinc-800 p-12 text-center">

                <h2 className="text-xl font-semibold text-white">

                    No Tasks Found

                </h2>

                <p className="mt-2 text-zinc-500">

                    Create your first task for this team.

                </p>

            </div>

        );

    }

    /*
    =====================================================
    GRID
    =====================================================
    */

    return (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {

                tasks.map(task => (

                    <TaskCard

                        key={task.id}

                        task={task}

                        onEdit={onEdit}

                        onDelete={onDelete}

                    />

                ))

            }

        </div>

    );

};

export default TaskGrid;