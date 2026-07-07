import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import {

    getExecutiveSummary,
    getProjectAnalysis,
    getProjectHealth,
    getRiskAnalysis,
    getDeadlinePrediction,
    getWorkloadAnalysis,
    getResourcePrediction,
    getProductivityAnalysis,
    getBottleneckAnalysis

} from "@/services/analytics.service";

export const useAnalytics = (
    projectId
) => {

    const cacheRef = useRef({});

    const [

        loading,

        setLoading

    ] = useState(false);

    const [

        error,

        setError

    ] = useState(null);

    const [

        selected,

        setSelected

    ] = useState(null);

    const [

        analysis,

        setAnalysis

    ] = useState(null);

    /*
    =====================================================
    RESET WHEN PROJECT CHANGES
    =====================================================
    */

    useEffect(() => {

        cacheRef.current = {};

        setSelected(null);

        setAnalysis(null);

        setError(null);

    }, [projectId]);

    /*
    =====================================================
    RUN ANALYSIS
    =====================================================
    */

    const runAnalysis = useCallback(

        async (type) => {

            if (!projectId) return;

            setSelected(type);

            /*
            ============================================
            CACHE
            ============================================
            */

            if (cacheRef.current[type]) {

                setAnalysis(

                    cacheRef.current[type]

                );

                return;

            }

            try {

                setLoading(true);

                setError(null);

                let response;

                switch (type) {

                    case "summary":

                        response =
                            await getExecutiveSummary(
                                projectId
                            );

                        break;

                    case "analysis":

                        response =
                            await getProjectAnalysis(
                                projectId
                            );

                        break;

                    case "health":

                        response =
                            await getProjectHealth(
                                projectId
                            );

                        break;

                    case "risk":

                        response =
                            await getRiskAnalysis(
                                projectId
                            );

                        break;

                    case "deadline":

                        response =
                            await getDeadlinePrediction(
                                projectId
                            );

                        break;

                    case "workload":

                        response =
                            await getWorkloadAnalysis(
                                projectId
                            );

                        break;

                    case "resource":

                        response =
                            await getResourcePrediction(
                                projectId
                            );

                        break;

                    case "productivity":

                        response =
                            await getProductivityAnalysis(
                                projectId
                            );

                        break;

                    case "bottleneck":

                        response =
                            await getBottleneckAnalysis(
                                projectId
                            );

                        break;

                    default:

                        return;

                }

                cacheRef.current[type] =
                    response;

                setAnalysis(response);

            }

            catch (err) {

                console.error(err);

                setError(

                    err.response?.data?.message ||

                    "Failed to generate AI analysis."

                );

            }

            finally {

                setLoading(false);

            }

        },

        [projectId]

    );

    /*
    =====================================================
    HELPERS
    =====================================================
    */

    const clearAnalysis = () => {

        setSelected(null);

        setAnalysis(null);

    };

    const clearCache = () => {

        cacheRef.current = {};

    };

    return {

        loading,

        error,

        selected,

        analysis,

        runAnalysis,

        clearAnalysis,

        clearCache

    };

};