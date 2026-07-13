import { useMemo, useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";

import { useManagerWorkspaceProjects } from "@/hooks/useManagerWorkspaceProjects";

import ProjectToolbar from "@/components/project/ProjectToolbar";
import ProjectGrid from "@/components/project/ProjectGrid";

const ManagerProjectsPage = () => {
    const { workspace } = useWorkspace();

    const {
        projects,
        loading
    } = useManagerWorkspaceProjects(workspace?.id);

    const [search, setSearch] = useState("");

    const filteredProjects = useMemo(() => {
        return projects.filter(project =>
            project.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [projects, search]);

    return (
        <main className="space-y-8">
            <ProjectToolbar
                search={search}
                setSearch={setSearch}
            />

            <ProjectGrid
                loading={loading}
                projects={filteredProjects}
                onEdit={null}
                onDelete={null}
            />
        </main>
    );
};

export default ManagerProjectsPage;
