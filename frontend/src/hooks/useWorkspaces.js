import { useEffect, useState } from "react";

import {
    getUserWorkspaces,
} from "@/services/workspace.service";

export const useWorkspaces = () => {

    const [workspaces, setWorkspaces] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchWorkspaces = async (

        page = 1,

        limit = 10

    ) => {

        try {

            setLoading(true);

            setError("");

            const response =

                await getUserWorkspaces(

                    page,

                    limit

                );

            setWorkspaces(

                response.data

            );

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.message ||

                "Failed to fetch workspaces."

            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchWorkspaces();

    }, []);

    return {

        workspaces,

        loading,

        error,

        refresh: fetchWorkspaces

    };

};