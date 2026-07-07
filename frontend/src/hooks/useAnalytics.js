import {
    useCallback,
    useEffect,
    useState
} from "react";

import {

    getProjectAnalysis,

    getProjectHealth,

    getRiskAnalysis,

    getDeadlinePrediction,

    getWorkloadAnalysis,

    getResourcePrediction,

    getProductivityAnalysis,

    getBottleneckAnalysis,

    getExecutiveSummary

} from "@/services/analytics.service";

export const useAnalytics = (
    projectId
) => {

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [projectAnalysis, setProjectAnalysis] =
        useState(null);

    const [projectHealth, setProjectHealth] =
        useState(null);

    const [riskAnalysis, setRiskAnalysis] =
        useState(null);

    const [deadlinePrediction, setDeadlinePrediction] =
        useState(null);

    const [workloadAnalysis, setWorkloadAnalysis] =
        useState(null);

    const [resourcePrediction, setResourcePrediction] =
        useState(null);

    const [productivityAnalysis, setProductivityAnalysis] =
        useState(null);

    const [bottleneckAnalysis, setBottleneckAnalysis] =
        useState(null);

    const [executiveSummary, setExecutiveSummary] =
        useState(null);

    /*
    =====================================================
    FETCH
    =====================================================
    */

    const fetchAnalytics =
        useCallback(async () => {

            if (!projectId) {

                setLoading(false);

                return;

            }

            try {

                setLoading(true);

                setError(null);

                const [

                    analysis,

                    health,

                    risk,

                    deadline,

                    workload,

                    resource,

                    productivity,

                    bottleneck,

                    executive

                ] = await Promise.all([

                    getProjectAnalysis(projectId),

                    getProjectHealth(projectId),

                    getRiskAnalysis(projectId),

                    getDeadlinePrediction(projectId),

                    getWorkloadAnalysis(projectId),

                    getResourcePrediction(projectId),

                    getProductivityAnalysis(projectId),

                    getBottleneckAnalysis(projectId),

                    getExecutiveSummary(projectId)

                ]);

                setProjectAnalysis(

                    analysis.data

                );

                setProjectHealth(

                    health.data

                );

                setRiskAnalysis(

                    risk.data

                );

                setDeadlinePrediction(

                    deadline.data

                );

                setWorkloadAnalysis(

                    workload.data

                );

                setResourcePrediction(

                    resource.data

                );

                setProductivityAnalysis(

                    productivity.data

                );

                setBottleneckAnalysis(

                    bottleneck.data

                );

                setExecutiveSummary(

                    executive.data

                );

            }

            catch (err) {

                console.error(err);

                setError(err);

            }

            finally {

                setLoading(false);

            }

        }, [projectId]);

    useEffect(() => {

        fetchAnalytics();

    }, [fetchAnalytics]);

    return {

        loading,

        error,

        refresh:

            fetchAnalytics,

        projectAnalysis,

        projectHealth,

        riskAnalysis,

        deadlinePrediction,

        workloadAnalysis,

        resourcePrediction,

        productivityAnalysis,

        bottleneckAnalysis,

        executiveSummary

    };

};