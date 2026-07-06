import { useState } from "react";

import {
    Shield,
    Trash2
} from "lucide-react";

import { theme } from "@/lib/theme";

import ChangeRoleModal from "./ChangeRoleModal";
import RemoveMemberDialog from "./RemoveMemberDialog";

const badgeColor = {

    owner:
        "bg-violet-500/20 text-violet-300",

    manager:
        "bg-blue-500/20 text-blue-300",

    team_lead:
        "bg-amber-500/20 text-amber-300",

    employee:
        "bg-green-500/20 text-green-300"

};

const MembersTable = ({
    workspaceId,
    members,
    refresh
}) => {

    const [selectedMember, setSelectedMember] =
        useState(null);

    const [roleOpen, setRoleOpen] =
        useState(false);

    const [removeOpen, setRemoveOpen] =
        useState(false);

    if (members.length === 0) {

        return (

            <div
                className="rounded-3xl border border-zinc-800 p-12 text-center"
            >

                <h2 className="text-xl font-semibold text-white">

                    No Members Found

                </h2>

                <p className="mt-2 text-zinc-500">

                    No members match your filters.

                </p>

            </div>

        );

    }

    return (

        <>

            <div

                className="overflow-hidden rounded-3xl"

                style={{

                    background:
                        "rgba(13,13,18,.55)",

                    border:
                        "1px solid rgba(167,139,250,.10)"

                }}

            >

                <table className="w-full">

                    <thead>

                        <tr className="border-b border-white/5">

                            <th className="px-6 py-5 text-left">

                                Member

                            </th>

                            <th className="text-left">

                                Email

                            </th>

                            <th className="text-left">

                                Role

                            </th>

                            <th className="pr-6 text-right">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            members.map(member => (

                                <tr

                                    key={member.id}

                                    className="border-b border-white/5 last:border-none"

                                >

                                    {/* Member */}

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-4">

                                            <img

                                                src={
                                                        member.avatar ||
                                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                            member.name || "User"
                                                        )}`
                                                    }

                                                alt={member.name}

                                                className="h-11 w-11 rounded-full object-cover"

                                            />

                                            <div>

                                                <p

                                                    className="font-medium"

                                                    style={{

                                                        color: theme.text

                                                    }}

                                                >

                                                    {member.name}

                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    {/* Email */}

                                    <td

                                        style={{

                                            color: theme.secondary

                                        }}

                                    >

                                        {member.email}

                                    </td>

                                    {/* System Role */}

                                    <td>

                                        <span

                                            className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor[member.sys_role]}`}

                                        >

                                            {member.sys_role.replace("_", " ")}

                                        </span>

                                    </td>

                                        

                                    {/* Actions */}

                                    <td className="pr-6">

                                        <div className="flex justify-end gap-3">

                                            <button

                                                onClick={() => {

                                                    setSelectedMember(member);

                                                    setRoleOpen(true);

                                                }}

                                                className="rounded-lg p-2 transition hover:bg-violet-500/10"

                                            >

                                                <Shield

                                                    size={18}

                                                    color={theme.primaryLight}

                                                />

                                            </button>

                                            <button

                                                onClick={() => {

                                                    setSelectedMember(member);

                                                    setRemoveOpen(true);

                                                }}

                                                className="rounded-lg p-2 transition hover:bg-red-500/10"

                                            >

                                                <Trash2

                                                    size={18}

                                                    color="#EF4444"

                                                />

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

            <ChangeRoleModal

                open={roleOpen}

                workspaceId={workspaceId}

                member={selectedMember}

                onClose={() => {

                    setRoleOpen(false);

                    setSelectedMember(null);

                }}

                refresh={refresh}

            />

            <RemoveMemberDialog

                open={removeOpen}

                workspaceId={workspaceId}

                member={selectedMember}

                onClose={() => {

                    setRemoveOpen(false);

                    setSelectedMember(null);

                }}

                refresh={refresh}

            />

        </>

    );

};

export default MembersTable;