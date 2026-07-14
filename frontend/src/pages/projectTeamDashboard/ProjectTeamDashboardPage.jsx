import { useParams } from "react-router-dom";

import { theme } from "@/lib/theme";

import { useState, useEffect } from "react";
import { useProjectTeamDashboard } from "@/hooks/useProjectTeamDashboard";
import TaskSection from "@/components/projectTask/TaskSection";
import { getManagerTeamMembers } from "@/services/manager.service";
import { Users, User as UserIcon, Activity } from "lucide-react";

const ProjectTeamDashboardPage = () => {

    const { projectTeamId } = useParams();

    const {

        dashboard,

        loading,

        error,

        refresh

    } = useProjectTeamDashboard(
        projectTeamId
    );

    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (projectTeamId) {
            getManagerTeamMembers(projectTeamId)
                .then(setMembers)
                .catch(() => console.error("Failed to fetch members"));
        }
    }, [projectTeamId]);

    /*
    =====================================================
    LOADING
    =====================================================
    */

    if (loading) {

        return (

            <div className="flex h-[80vh] items-center justify-center">

                <div

                    className="h-14 w-14 animate-spin rounded-full border-4 border-t-transparent"

                    style={{

                        borderColor:
                            "rgba(167,139,250,.25)",

                        borderTopColor:
                            theme.primary

                    }}

                />

            </div>

        );

    }

    /*
    =====================================================
    ERROR
    =====================================================
    */

    if (error || !dashboard) {

        return (

            <div

                className="flex h-[80vh] items-center justify-center text-xl"

                style={{

                    color: theme.text

                }}

            >

                Failed to load Project Team Dashboard.

            </div>

        );

    }

        /*
    =====================================================
    UI
    =====================================================
    */

    const leader = members.find(m => m.isLeader);
    const memberCount = members.length;

    return (
        <main className="max-w-7xl mx-auto space-y-8 pb-12 mt-4">
            {/* 1. Header (Team Name & Stats) */}
            <div className="flex flex-col gap-5 px-2">
                <h1 className="text-[32px] font-bold text-zinc-100 tracking-tight leading-none">
                    {dashboard.team.name}
                </h1>
                
                <div className="flex items-center flex-wrap gap-4 text-[14px] text-zinc-400 font-medium">
                    <div className="flex items-center gap-2">
                        <UserIcon size={16} className="text-violet-400" />
                        <span>{leader ? leader.name : "No Leader"}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-400" />
                        <span>{memberCount} Members</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <div className="flex items-center gap-2">
                        <Activity size={16} className="text-emerald-400" />
                        <span>{dashboard.progress || 0}% Progress</span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-800/60 w-full rounded-full" />

            <TaskSection

                projectTeamId={projectTeamId}

            />

            

        </main>

    );

};

export default ProjectTeamDashboardPage;