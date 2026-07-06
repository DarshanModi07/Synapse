import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { theme } from "@/lib/theme";

import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";

import MembersHeader from "@/components/members/MembersHeader";
import MemberStatistics from "@/components/members/MemberStatistics";
import MemberToolbar from "@/components/members/MemberToolbar";
import MembersTable from "@/components/members/MembersTable";

const MembersPage = () => {

    const { slug } = useParams();

    const {
        workspaces,
        loading: workspaceLoading
    } = useWorkspaces();

    const workspace = useMemo(() => {

        const current = workspaces.find(
            item => item.workspace.slug === slug
        );

        return current?.workspace;

    }, [workspaces, slug]);

    const {

        members,

        loading,

        inviteMember,

        inviting,

        refresh

    } = useWorkspaceMembers(
        workspace?.id
    );

    const [search, setSearch] = useState("");

    const [role, setRole] = useState("all");

    const filteredMembers = useMemo(() => {

    return members.filter(member => {

        const name =
            member.name?.toLowerCase() || "";

        const email =
            member.email?.toLowerCase() || "";

        const matchesSearch =
            name.includes(search.toLowerCase()) ||
            email.includes(search.toLowerCase());

        const matchesRole =
            role === "all" ||
            member.sys_role === role;

        return matchesSearch && matchesRole;

    });

}, [members, search, role]);

    if (workspaceLoading || loading) {

        return (

            <div className="flex h-[80vh] items-center justify-center">

                <div
                    className="h-14 w-14 animate-spin rounded-full border-4 border-t-transparent"
                    style={{
                        borderColor: "rgba(167,139,250,.25)",
                        borderTopColor: theme.primary
                    }}
                />

            </div>

        );

    }

    if (!workspace) {

        return (

            <div
                className="flex h-[80vh] items-center justify-center"
                style={{
                    color: theme.text
                }}
            >

                Workspace not found.

            </div>

        );

    }

    return (

        <main className="space-y-8">

            <MembersHeader
                workspaceId={workspace.id}
                members={members}
                inviteMember={inviteMember}
                inviting={inviting}
            />

            <MemberStatistics
                members={members}
            />

            <MemberToolbar
                search={search}
                setSearch={setSearch}
                role={role}
                setRole={setRole}
                total={filteredMembers.length}
            />

            <MembersTable
                workspaceId={workspace.id}
                members={filteredMembers}
                refresh={refresh}
            />

        </main>

    );

};

export default MembersPage;