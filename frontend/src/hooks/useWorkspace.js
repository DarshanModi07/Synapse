import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    getWorkspace
} from "@/services/workspace.service";

export const useWorkspace = (
    slug
) => {

    const [workspace, setWorkspace] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchWorkspace =
        useCallback(async () => {

            if (!slug) {

                setLoading(false);

                return;

            }

            try {

                setLoading(true);

                setError("");

                const response =
                    await getWorkspace(slug);

                setWorkspace(response.data);

            }

            catch (err) {

                console.error(err);

                setError(

                    err.response?.data?.message ||

                    "Failed to fetch workspace."

                );

            }

            finally {

                setLoading(false);

            }

        }, [slug]);

    useEffect(() => {

        fetchWorkspace();

    }, [fetchWorkspace]);

    return {

        workspace,

        loading,

        error,

        refresh: fetchWorkspace

    };

};