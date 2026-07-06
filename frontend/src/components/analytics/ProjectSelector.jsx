import { FolderGit2 } from "lucide-react";

import { theme } from "@/lib/theme";

const ProjectSelector = ({

    projects,

    selectedProject,

    setSelectedProject

}) => {

    return (

        <section

            className="rounded-3xl p-6"

            style={{

                background: "rgba(13,13,18,.55)",

                border: "1px solid rgba(167,139,250,.10)",

                backdropFilter: "blur(20px)"

            }}

        >

            <div className="flex items-center gap-3">

                <FolderGit2

                    size={22}

                    color={theme.primaryLight}

                />

                <div>

                    <h2

                        className="text-lg font-semibold"

                        style={{

                            color: theme.text

                        }}

                    >

                        Select Project

                    </h2>

                    <p

                        className="text-sm"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Choose a project to generate AI analytics.

                    </p>

                </div>

            </div>

            <select

                value={selectedProject}

                onChange={(e) =>

                    setSelectedProject(

                        e.target.value

                    )

                }

                className="mt-6 w-full rounded-2xl border border-zinc-700 bg-[#13111C] px-5 py-4 outline-none transition focus:border-violet-500"

                style={{

                    color: theme.text

                }}

            >

                {

                    projects.length === 0

                    &&

                    (

                        <option value="">

                            No Projects Found

                        </option>

                    )

                }

                {

                    projects.map(project => (

                        <option

                            key={project.id}

                            value={project.id}

                        >

                            {project.name}

                        </option>

                    ))

                }

            </select>

        </section>

    );

};

export default ProjectSelector;