import { useState } from "react";

import TeamCard from "./TeamCard";
import AssignTeamModal from "./AssignTeamModal";
import RemoveTeamDialog from "./RemoveTeamDialog";
import AITaskPlanningModal from "../AITaskPlanningModal";

import { Sparkles } from "lucide-react";

import {
    assignTeam,
    removeTeam
} from "@/services/projectTeam.service";

const ProjectTeams = ({
    projectId,
    project,
    teams = [],
    departments = [],
    refresh,
    hideAssign
}) => {

    const [aiModalOpen, setAiModalOpen] = useState(false);

    const [assignOpen, setAssignOpen] =
        useState(false);

    const [removeOpen, setRemoveOpen] =
        useState(false);

    const [selectedTeam, setSelectedTeam] =
        useState(null);

    const [assigning, setAssigning] =
        useState(false);

    const [removing, setRemoving] =
        useState(false);

    /*
    =====================================================
    ASSIGN TEAM
    =====================================================
    */

    const handleAssign = async (
        projectDepartmentId,
        teamId
    ) => {

        try {

            setAssigning(true);

            await assignTeam(
                projectDepartmentId,
                teamId
            );

            setAssignOpen(false);

            refresh();

        }
        catch (err) {

            console.error(err);

        }
        finally {

            setAssigning(false);

        }

    };

    /*
    =====================================================
    REMOVE TEAM
    =====================================================
    */

    const handleRemove = async () => {

        if (!selectedTeam) return;

        try {

            setRemoving(true);

            await removeTeam(

                selectedTeam.projectDepartmentId,

                selectedTeam.teamId

            );

            setRemoveOpen(false);

            setSelectedTeam(null);

            refresh();

        }
        catch (err) {

            console.error(err);

        }
        finally {

            setRemoving(false);

        }

    };

    return (

        <>

            <div className="space-y-6">

                {/* Header */}

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="text-xl font-semibold">

                            Teams

                        </h2>

                        <p className="text-sm text-zinc-400">

                            Manage all teams assigned to this project.

                        </p>

                    </div>

                    <div className="flex w-full gap-3 sm:w-auto">
                        {!hideAssign && (
                            <button
                                onClick={() =>
                                    setAssignOpen(true)
                                }
                                className="flex-1 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium transition hover:bg-violet-500 sm:flex-none"
                            >
                                Assign Team
                            </button>
                        )}
                        
                        <button
                            onClick={() => setAiModalOpen(true)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600/10 px-4 py-2 text-sm font-medium text-purple-400 transition hover:bg-purple-600/20 sm:flex-none"
                        >
                            <Sparkles size={16} />
                            AI Task Planner
                        </button>
                    </div>

                </div>

                {/* Grid */}

                {

                    teams.length === 0 ?

                        (

                            <div className="rounded-2xl border border-zinc-800 p-10 text-center text-zinc-500">

                                No teams assigned.

                            </div>

                        )

                        :

                        (

                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                                {

                                    teams.map(team => (

                                        <TeamCard

                                            key={team.projectTeamId}

                                            team={team}

                                            onRemove={() => {

                                                setSelectedTeam(team);

                                                setRemoveOpen(true);

                                            }}

                                        />

                                    ))

                                }

                            </div>

                        )

                }

            </div>

            <AssignTeamModal

                open={assignOpen}

                departments={departments}

                loading={assigning}

                onClose={() =>
                    setAssignOpen(false)
                }

                onAssign={handleAssign}

            />

            <RemoveTeamDialog

                open={removeOpen}

                loading={removing}

                team={selectedTeam}

                onClose={() => {

                    setRemoveOpen(false);

                    setSelectedTeam(null);

                }}

                onRemove={handleRemove}

            />

            {aiModalOpen && (
                <AITaskPlanningModal
                    projectId={projectId}
                    project={project}
                    teams={teams}
                    onClose={() => setAiModalOpen(false)}
                    onRefresh={refresh}
                />
            )}

        </>

    );

};

export default ProjectTeams;