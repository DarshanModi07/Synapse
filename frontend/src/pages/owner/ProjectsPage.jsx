import { useMemo, useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";

import { useProjects } from "@/hooks/useProjects";

import ProjectToolbar from "@/components/project/ProjectToolbar";
import ProjectGrid from "@/components/project/ProjectGrid";

import CreateProjectModal from "@/components/project/CreateProjectModal";
import EditProjectModal from "@/components/project/EditProjectModal";
import DeleteProjectDialog from "@/components/project/DeleteProjectDialog";

const ProjectsPage = () => {

    const { workspace } = useWorkspace();

    const {

        projects,

        loading,

        creating,

        updating,

        deleting,

        addProject,

        editProject,

        removeProject

    } = useProjects(workspace?.id);

    const [search, setSearch] =
        useState("");

    const [createOpen, setCreateOpen] =
        useState(false);

    const [editOpen, setEditOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedProject, setSelectedProject] =
        useState(null);

            /*
    ==========================================================
    FILTER PROJECTS
    ==========================================================
    */

    const filteredProjects = useMemo(() => {

        return projects.filter(project =>

            project.name
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [projects, search]);

    /*
    ==========================================================
    CREATE PROJECT
    ==========================================================
    */

    const handleCreate = async (data) => {

        try {

            await addProject(data);

            setCreateOpen(false);

        }

        catch (err) {

            console.error(err);

        }

    };

    /*
    ==========================================================
    EDIT PROJECT
    ==========================================================
    */

    const handleUpdate = async (
        projectId,
        data
    ) => {

        try {

            await editProject(
                projectId,
                data
            );

            setEditOpen(false);

            setSelectedProject(null);

        }

        catch (err) {

            console.error(err);

        }

    };

    /*
    ==========================================================
    DELETE PROJECT
    ==========================================================
    */

    const handleDelete = async (
        projectId
    ) => {

        try {

            await removeProject(projectId);

            setDeleteOpen(false);

            setSelectedProject(null);

        }

        catch (err) {

            console.error(err);

        }

    };

        return (
            <main

                className="min-h-[calc(100vh-130px)] rounded-3xl p-8"

                style={{

                    background: "rgba(13,13,18,.55)",

                    border:
                        "1px solid rgba(167,139,250,.10)",

                    backdropFilter: "blur(24px)"

                }}

            >
                {/* Header */}
                <div className="mb-8">

                    <h1 className="text-4xl font-bold text-white">

                        Projects

                    </h1>

                    <p className="mt-2 text-zinc-400">

                        Manage projects, assign departments, teams and track progress.

                    </p>

                </div>
                {/* Toolbar */}
                <ProjectToolbar

                    search={search}

                    setSearch={setSearch}

                    onCreate={() =>
                        setCreateOpen(true)
                    }

                    onAI={() => {}}

                />
                {/* Grid */}
                <ProjectGrid

                    loading={loading}

                    projects={filteredProjects}

                    onEdit={(project) => {

                        setSelectedProject(project);

                        setEditOpen(true);

                    }}

                    onDelete={(project) => {

                        setSelectedProject(project);

                        setDeleteOpen(true);

                    }}

                />
                {/* Create Project */}
                <CreateProjectModal

                    open={createOpen}

                    loading={creating}

                    workspaceId={workspace?.id}

                    onClose={() =>
                        setCreateOpen(false)
                    }

                    onCreate={handleCreate}

                />
                {/* Edit Project */}
                <EditProjectModal

                    open={editOpen}

                    loading={updating}

                    project={selectedProject}

                    onClose={() => {

                        setEditOpen(false);

                        setSelectedProject(null);

                    }}

                    onSave={handleUpdate}

                />
                {/* Delete Project */}
                <DeleteProjectDialog

                    open={deleteOpen}

                    loading={deleting}

                    project={selectedProject}

                    onClose={() => {

                        setDeleteOpen(false);

                        setSelectedProject(null);

                    }}

                    onDelete={handleDelete}

                />
            </main>
        );

};

export default ProjectsPage;