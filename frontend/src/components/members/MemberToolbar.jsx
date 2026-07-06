import { Search, Filter } from "lucide-react";

import { theme } from "@/lib/theme";

const MemberToolbar = ({

    search,

    setSearch,

    role,

    setRole,

    total

}) => {

    return (

        <section

            className="rounded-3xl p-6"

            style={{

                background: "rgba(13,13,18,.55)",

                border: "1px solid rgba(167,139,250,.10)",

                backdropFilter: "blur(24px)"

            }}

        >

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                {/* Search */}

                <div className="relative w-full lg:max-w-md">

                    <Search

                        size={18}

                        className="absolute left-4 top-1/2 -translate-y-1/2"

                        color={theme.secondary}

                    />

                    <input

                        value={search}

                        onChange={(e) =>

                            setSearch(

                                e.target.value

                            )

                        }

                        placeholder="Search member..."

                        className="w-full rounded-xl border border-zinc-700 bg-transparent py-3 pl-12 pr-4 outline-none"

                        style={{

                            color: theme.text

                        }}

                    />

                </div>

                <div className="flex items-center gap-4">

                    {/* Role Filter */}

                    <div className="relative">

                        <Filter

                            size={18}

                            className="absolute left-3 top-1/2 -translate-y-1/2"

                            color={theme.secondary}

                        />

                        <select

                            value={role}

                            onChange={(e) =>

                                setRole(

                                    e.target.value

                                )

                            }

                            className="rounded-xl border border-zinc-700 bg-[#13111C] py-3 pl-10 pr-8 outline-none"

                            style={{

                                color: theme.text

                            }}

                        >

                            <option value="all">

                                All Roles

                            </option>

                            <option value="owner">

                                Owner

                            </option>

                            <option value="manager">

                                Manager

                            </option>

                            <option value="team_lead">

                                Team Lead

                            </option>

                            <option value="employee">

                                Employee

                            </option>

                        </select>

                    </div>

                    {/* Count */}

                    <div

                        className="rounded-xl px-4 py-3"

                        style={{

                            background:

                                "rgba(124,58,237,.12)",

                            color:

                                theme.primaryLight

                        }}

                    >

                        {total} Members

                    </div>

                </div>

            </div>

        </section>

    );

};

export default MemberToolbar;