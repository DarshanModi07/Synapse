import api from "@/api/axios";

/*
|--------------------------------------------------------------------------
| Get Members
|--------------------------------------------------------------------------
*/

export const getWorkspaceMembers = async (
    workspaceId
) => {

    const response = await api.get(
        `/workspace/${workspaceId}/members`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Remove Member
|--------------------------------------------------------------------------
*/

export const removeWorkspaceMember = async (
    workspaceId,
    userId
) => {

    const response = await api.delete(
        `/workspace/${workspaceId}/member/${userId}`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Change Role
|--------------------------------------------------------------------------
*/

export const changeWorkspaceRole = async (
    workspaceId,
    userId,
    sys_role
) => {

    const response = await api.patch(
        `/workspace/${workspaceId}/member/${userId}/role`,
        {
            sys_role
        }
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Invite Member
|--------------------------------------------------------------------------
*/

export const inviteWorkspaceMember = async (
    data
) => {

    const response = await api.post(
        "/workspace/inviteUser",
        data
    );

    return response.data;

};