import {
    useCallback,
    useEffect,
    useState
} from "react";

import {

    getWorkspaceMembers,

    removeWorkspaceMember,

    changeWorkspaceRole,

    inviteWorkspaceMember

} from "@/services/workspaceMember.service";

export const useWorkspaceMembers = (
    workspaceId
) => {

    const [members, setMembers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [inviting, setInviting] =
        useState(false);

    const [removing, setRemoving] =
        useState(false);

    const [changingRole, setChangingRole] =
        useState(false);

    const fetchMembers =
        useCallback(async () => {

            if (!workspaceId) {

                setMembers([]);

                setLoading(false);

                return;

            }

            try {

                setLoading(true);

                const response =
                    await getWorkspaceMembers(
                        workspaceId
                    );

                setMembers(response.data);

                setError(null);

            }
            catch (err) {

                console.error(err);

                setError(err);

            }
            finally {

                setLoading(false);

            }

        }, [workspaceId]);

    useEffect(() => {

        fetchMembers();

    }, [fetchMembers]);


    const inviteMember = async (
        data
    ) => {

        try {

            setInviting(true);

            await inviteWorkspaceMember(
                data
            );

            await fetchMembers();

        }
        finally {

            setInviting(false);

        }

    };

    const removeMember = async (
        userId
    ) => {

        try {

            setRemoving(true);

            await removeWorkspaceMember(
                workspaceId,
                userId
            );

            await fetchMembers();

        }
        finally {

            setRemoving(false);

        }

    };

    const changeRole = async (
        userId,
        sys_role
    ) => {

        try {

            setChangingRole(true);

            await changeWorkspaceRole(
                workspaceId,
                userId,
                sys_role
            );

            await fetchMembers();

        }
        finally {

            setChangingRole(false);

        }

    };

    return {

        members,

        loading,

        error,

        inviting,

        removing,

        changingRole,

        refresh:
            fetchMembers,

        inviteMember,

        removeMember,

        changeRole

    };

};