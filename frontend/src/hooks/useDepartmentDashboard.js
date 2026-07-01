import { useEffect, useState } from "react";

import {
    getDepartmentDashboard
} from "@/services/departmentDashboard.service";

export const useDepartmentDashboard = (
    departmentId
) => {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    useEffect(() => {

        if (!departmentId) return;

        const fetchDashboard = async () => {

            try {

                setLoading(true);

                const response =
                    await getDepartmentDashboard(
                        departmentId
                    );

                setDashboard(response.data);

            }
            catch (err) {

                console.error(err);

                setError(err);

            }
            finally {

                setLoading(false);

            }

        };

        fetchDashboard();

    }, [departmentId]);

    return {

        dashboard,

        loading,

        error

    };

};