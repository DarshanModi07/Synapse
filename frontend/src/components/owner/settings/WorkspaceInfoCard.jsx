import { ImagePlus } from "lucide-react";

import { theme } from "@/lib/theme";

import { useWorkspaceSettings } from "@/hooks/useWorkspaceSettings";

const WorkspaceInfoCard = ({

    workspace,

    refreshWorkspace

}) => {

    const {

        name,

        setName,

        description,

        setDescription,

        preview,

        selectLogo,

        saveWorkspace,

        saving,

        error

    } = useWorkspaceSettings(

    workspace,

    refreshWorkspace

);

    return (

        <section

            className="rounded-3xl p-8"

            style={{

                background:
                    "rgba(13,13,18,.55)",

                border:
                    "1px solid rgba(167,139,250,.10)"

            }}

        >

            <div>

                <h2

                    className="text-2xl font-semibold"

                    style={{

                        color:
                            theme.text

                    }}

                >

                    Workspace Information

                </h2>

                <p

                    className="mt-2"

                    style={{

                        color:
                            theme.secondary

                    }}

                >

                    Update your workspace details.

                </p>

            </div>

            {/* Logo */}

            <div className="mt-10 flex items-center gap-6">

                <img

                    src={
                        preview ||

                        `https://ui-avatars.com/api/?name=${encodeURIComponent(

                            name ||

                            "Workspace"

                        )}`
                    }

                    alt="Workspace"

                    className="h-24 w-24 rounded-2xl border border-zinc-700 object-cover"

                />

                <label

                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-700 px-5 py-3 transition hover:border-violet-500"

                    style={{

                        color:
                            theme.secondary

                    }}

                >

                    <ImagePlus size={18} />

                    Change Logo

                    <input

                        type="file"

                        accept="image/*"

                        hidden

                        onChange={(e) =>

                            selectLogo(

                                e.target.files[0]

                            )

                        }

                    />

                </label>

            </div>

            {/* Name */}

            <div className="mt-10">

                <label

                    className="mb-2 block"

                    style={{

                        color:
                            theme.secondary

                    }}

                >

                    Workspace Name

                </label>

                <input

                    value={name}

                    onChange={(e) =>

                        setName(

                            e.target.value

                        )

                    }

                    className="w-full rounded-xl border border-zinc-700 bg-[#13111C] px-5 py-3 outline-none transition focus:border-violet-500"

                    style={{

                        color:
                            theme.text

                    }}

                />

            </div>

            {/* Slug */}

            <div className="mt-6">

                <label

                    className="mb-2 block"

                    style={{

                        color:
                            theme.secondary

                    }}

                >

                    Workspace Slug

                </label>

                <input

                    value={

                        workspace.slug

                    }

                    readOnly

                    className="w-full cursor-not-allowed rounded-xl border border-zinc-800 bg-[#0D0D12] px-5 py-3"

                    style={{

                        color:
                            theme.muted

                    }}

                />

            </div>

            {/* Description */}

            <div className="mt-6">

                <label

                    className="mb-2 block"

                    style={{

                        color:
                            theme.secondary

                    }}

                >

                    Description

                </label>

                <textarea

                    rows={5}

                    value={description}

                    onChange={(e) =>

                        setDescription(

                            e.target.value

                        )

                    }

                    className="w-full resize-none rounded-xl border border-zinc-700 bg-[#13111C] px-5 py-4 outline-none transition focus:border-violet-500"

                    style={{

                        color:
                            theme.text

                    }}

                />

            </div>

            {

                error && (

                    <p

                        className="mt-5"

                        style={{

                            color:
                                "#EF4444"

                        }}

                    >

                        {error}

                    </p>

                )

            }

            <div className="mt-8 flex justify-end">

                <button

                    disabled={saving}

                    onClick={saveWorkspace}

                    className="rounded-xl bg-violet-600 px-8 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"

                >

                    {

                        saving

                            ? "Saving..."

                            : "Save Changes"

                    }

                </button>

            </div>

        </section>

    );

};

export default WorkspaceInfoCard;