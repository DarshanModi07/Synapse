import { useEffect, useMemo, useState } from "react";

import {
    Search,
    Users,
    User,
    Check
} from "lucide-react";

import { getAvailableTeams } from "@/services/projectTeam.service";

import { theme } from "@/lib/theme";

const AssignTeamModal = ({
    open,
    departments,
    loading,
    onClose,
    onAssign
}) => {

    console.log("Departments :", departments);

    const projectDepartmentId =
    departments?.[0]?.projectDepartmentId;

    const [teams, setTeams] =
        useState([]);

    const [selectedTeam, setSelectedTeam] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [fetching, setFetching] =
        useState(false);

    /*
    =====================================================
    LOAD AVAILABLE TEAMS
    =====================================================
    */

useEffect(() => {

    if (!open) return;

    if (!projectDepartmentId) return;

    fetchTeams();

}, [open, projectDepartmentId, departments]);

    const fetchTeams = async () => {

        try {

            setFetching(true);

            const response =
                await getAvailableTeams(
                    projectDepartmentId
                );

            setTeams(
                response.data || []
            );

        }
        catch (err) {

            console.error(err);

        }
        finally {

            setFetching(false);

        }

    };

    /*
    =====================================================
    FILTER
    =====================================================
    */

    const filteredTeams =
        useMemo(() => {

            return teams.filter(team =>
                team.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
            );

        }, [teams, search]);

    /*
    =====================================================
    ASSIGN
    =====================================================
    */

const handleAssign = async () => {

    if (!selectedTeam) return;

    if (!projectDepartmentId) return;

    try {

        await onAssign(

            projectDepartmentId,

            selectedTeam

        );

    }

    catch (err) {

        console.error(err);

    }

};

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

            <div
                className="w-full max-w-2xl rounded-3xl p-7"
                style={{
                    background: theme.card,
                    border:
                        "1px solid rgba(167,139,250,.15)"
                }}
            >

                {/* Header */}

                <h2
                    className="text-2xl font-semibold"
                    style={{
                        color: theme.text
                    }}
                >
                    Assign Team
                </h2>

                <p
                    className="mt-2"
                    style={{
                        color: theme.secondary
                    }}
                >
                    Select a team to assign to this
                    department.
                </p>

                {/* Search */}

                <div
                    className="mt-6 flex items-center rounded-xl px-4"
                    style={{
                        background:
                            "rgba(255,255,255,.05)"
                    }}
                >

                    <Search
                        size={18}
                        color={theme.secondary}
                    />

                    <input

                        value={search}

                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }

                        className="w-full bg-transparent p-4 outline-none"

                        placeholder="Search Team"

                    />

                </div>

                {/* List */}

                <div className="mt-6 max-h-96 space-y-3 overflow-y-auto">

                    {

                        fetching ?

                            <div
                                className="py-10 text-center"
                                style={{
                                    color:
                                        theme.secondary
                                }}
                            >
                                Loading...
                            </div>

                            :

                            filteredTeams.length === 0 ?

                                <div
                                    className="py-10 text-center"
                                    style={{
                                        color:
                                            theme.secondary
                                    }}
                                >
                                    No available teams.
                                </div>

                                :

                                filteredTeams.map(team => (

                                    <button

                                        key={team.id}

                                        onClick={() =>
                                            setSelectedTeam(
                                                team.id
                                            )
                                        }

                                        className="flex w-full items-center justify-between rounded-2xl p-5 transition"

                                        style={{

                                            background:

                                                selectedTeam === team.id

                                                    ?

                                                    "rgba(124,58,237,.18)"

                                                    :

                                                    "rgba(255,255,255,.04)"

                                        }}

                                    >

                                        <div className="flex items-center gap-4">

                                            <Users
                                                color={
                                                    theme.primaryLight
                                                }
                                            />

                                            <div className="text-left">

                                                <h3
                                                    style={{
                                                        color:
                                                            theme.text
                                                    }}
                                                >
                                                    {team.name}
                                                </h3>

                                                <div
                                                    className="mt-1 flex items-center gap-2 text-sm"
                                                    style={{
                                                        color:
                                                            theme.secondary
                                                    }}
                                                >

                                                    <User
                                                        size={15}
                                                    />

                                                    {

                                                        team.leader
                                                            ?.name ||

                                                        "No Leader"

                                                    }

                                                </div>

                                            </div>

                                        </div>

                                        {

                                            selectedTeam ===
                                            team.id &&

                                            <Check
                                                color="#22c55e"
                                            />

                                        }

                                    </button>

                                ))

                    }

                </div>

                {/* Footer */}

                <div className="mt-8 flex justify-end gap-3">

                    <button

                        onClick={onClose}

                        className="rounded-xl px-5 py-3"

                        style={{
                            color:
                                theme.secondary
                        }}

                    >
                        Cancel
                    </button>

                    <button

                        disabled={
                            !selectedTeam ||
                            loading
                        }

                        onClick={handleAssign}

                        className="rounded-xl px-6 py-3 text-white"

                        style={{
                            background:
                                theme.primary
                        }}

                    >

                        {

                            loading

                                ?

                                "Assigning..."

                                :

                                "Assign Team"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

};

export default AssignTeamModal;