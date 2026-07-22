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

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">

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

                    <div className="flex w-full sm:w-auto">
                        <button

                            onClick={() =>
                                setOpen(true)
                            }

                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-white transition hover:bg-violet-500 sm:flex-none"

                        >

                            <UserPlus size={18} />

                            Invite Member

                        </button>
                    </div>

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