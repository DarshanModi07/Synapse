import { useState } from "react";

import { UserPlus } from "lucide-react";

import { theme } from "@/lib/theme";

import InviteMemberModal from "./InviteMemberModal";

const MembersHeader = ({

    workspaceId,

    members,

    inviteMember,

    inviting

}) => {

    const [open, setOpen] =
        useState(false);

    return (

        <>

            <section
                className="rounded-3xl p-8"
                style={{
                    background: "rgba(13,13,18,.55)",
                    border: "1px solid rgba(167,139,250,.10)",
                    backdropFilter: "blur(24px)"
                }}
            >

                <div className="flex items-center justify-between">

                    <div>

                        <h1
                            className="text-4xl font-bold"
                            style={{
                                color: theme.text
                            }}
                        >

                            Workspace Members

                        </h1>

                        <p
                            className="mt-2"
                            style={{
                                color: theme.secondary
                            }}
                        >

                            Manage all workspace members.

                        </p>

                    </div>

                    <button

                        onClick={() =>
                            setOpen(true)
                        }

                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-white transition hover:bg-violet-500"

                    >

                        <UserPlus size={18} />

                        Invite Member

                    </button>

                </div>

            </section>

            <InviteMemberModal

                open={open}

                workspaceId={workspaceId}

                loading={inviting}

                onClose={() =>
                    setOpen(false)
                }

                onInvite={async (data) => {

                    await inviteMember(data);

                    setOpen(false);

                }}

            />

        </>

    );

};

export default MembersHeader;