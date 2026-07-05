import ProjectCard from "./ProjectCard";

const ProjectGrid = ({
    loading,
    projects,
    onEdit,
    onDelete
}) => {

    if (loading) {

        return (

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {[...Array(6)].map((_, index) => (

                    <div
                        key={index}
                        className="h-72 animate-pulse rounded-3xl bg-zinc-900"
                    />

                ))}

            </div>

        );

    }

    if (!projects.length) {

        return (

            <div className="rounded-3xl border border-zinc-800 p-12 text-center">

                <h2 className="text-2xl font-semibold text-white">

                    No Projects Found

                </h2>

                <p className="mt-3 text-zinc-400">

                    Create your first project to start planning work.

                </p>

            </div>

        );

    }

    return (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {

                projects.map(project => (

                    <ProjectCard

                        key={project.id}

                        project={project}

                        onEdit={onEdit}

                        onDelete={onDelete}

                    />

                ))

            }

        </div>

    );

};

export default ProjectGrid;