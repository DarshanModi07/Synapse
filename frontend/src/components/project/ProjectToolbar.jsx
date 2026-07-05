import { Search, Plus, Sparkles } from "lucide-react";

import { theme } from "@/lib/theme";

const ProjectToolbar = ({
    search,
    setSearch,
    onCreate,
    onAI
}) => {

    return (

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}

            <div className="relative w-full lg:max-w-md">

                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    color={theme.secondary}
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search projects..."
                    className="w-full rounded-2xl py-3 pl-12 pr-4 outline-none"
                    style={{
                        background: "rgba(255,255,255,.03)",
                        border: "1px solid rgba(255,255,255,.06)",
                        color: theme.text
                    }}
                />

            </div>

            {/* Buttons */}

            <div className="flex gap-3">

                <button

                    onClick={onAI}

                    className="flex items-center gap-2 rounded-2xl px-5 py-3 transition"

                    style={{
                        background:
                            "rgba(124,58,237,.18)",
                        color:
                            theme.primaryLight
                    }}

                >

                    <Sparkles size={18} />

                    AI Suggest

                </button>

                <button

                    onClick={onCreate}

                    className="flex items-center gap-2 rounded-2xl px-5 py-3 text-white transition"

                    style={{
                        background:
                            theme.primary
                    }}

                >

                    <Plus size={18} />

                    Create Project

                </button>

            </div>

        </div>

    );

};

export default ProjectToolbar;