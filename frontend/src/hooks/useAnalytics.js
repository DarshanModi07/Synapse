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

    const [analysis, setAnalysis] =
        useState(null);

    const [health, setHealth] =
        useState(null);

    const [risk, setRisk] =
        useState(null);

    const [deadline, setDeadline] =
        useState(null);

    const [workload, setWorkload] =
        useState(null);

    const [resources, setResources] =
        useState(null);

    const [productivity, setProductivity] =
        useState(null);

    const [bottlenecks, setBottlenecks] =
        useState(null);

    const [summary, setSummary] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

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

                    analysisRes,

                    healthRes,

                    riskRes,

                    deadlineRes,

                    workloadRes,

                    resourceRes,

                    productivityRes,

                    bottleneckRes,

                    summaryRes

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

                setAnalysis(
                    analysisRes.data
                );

                setHealth(
                    healthRes.data
                );

                setRisk(
                    riskRes.data
                );

                setDeadline(
                    deadlineRes.data
                );

                setWorkload(
                    workloadRes.data
                );

                setResources(
                    resourceRes.data
                );

                setProductivity(
                    productivityRes.data
                );

                setBottlenecks(
                    bottleneckRes.data
                );

                setSummary(
                    summaryRes.data
                );

            }
            catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load analytics."
                );

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

        refresh: fetchAnalytics,

        analysis,

        health,

        risk,

        deadline,

        workload,

        resources,

        productivity,

        bottlenecks,

        summary

    };

};