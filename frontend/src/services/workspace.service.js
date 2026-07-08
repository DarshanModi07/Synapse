import api from "@/api/axios";

/*
|--------------------------------------------------------------------------
| Get User Workspaces
|--------------------------------------------------------------------------
*/

export const getUserWorkspaces = async (

    page = 1,

    limit = 10

) => {

    const response = await api.get(

        `/workspace?page=${page}&limit=${limit}`

    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Get Workspace
|--------------------------------------------------------------------------
*/

export const getWorkspace = async (

    slug

) => {

    const response = await api.get(

        `/workspace/${slug}`

    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Create Workspace
|--------------------------------------------------------------------------
*/

export const createWorkspace = async (

    workspaceData

) => {

    const response = await api.post(

        "/workspace/createWorkspace",

        workspaceData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Update Workspace
|--------------------------------------------------------------------------
*/

export const updateWorkspace = async (

    workspaceId,

    formData

) => {

    const response = await api.patch(

        `/workspace/${workspaceId}`,

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Delete Workspace
|--------------------------------------------------------------------------
*/

export const deleteWorkspace = async (

    workspaceId

) => {

    const response = await api.delete(

        `/workspace/${workspaceId}`

    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Owner Dashboard
|--------------------------------------------------------------------------
*/

export const getOwnerDashboard = async (

    workspaceId

) => {

    const response = await api.get(

        `/workspace/${workspaceId}/dashboard`

    );

    return response.data;

};