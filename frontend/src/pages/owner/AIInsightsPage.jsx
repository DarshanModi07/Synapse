import { useParams } from "react-router-dom";

import { theme } from "@/lib/theme";

import { useAnalytics } from "@/hooks/useAnalytics";

import ExecutiveSummaryCard from "@/components/analytics/ExecutiveSummaryCard";
import ProjectHealthCard from "@/components/analytics/ProjectHealthCard";
import ProjectAnalysisCard from "@/components/analytics/ProjectAnalysisCard";
import DeadlinePredictionCard from "@/components/analytics/DeadlinePredictionCard";
import RiskAnalysisCard from "@/components/analytics/RiskAnalysisCard";
import BottleneckAnalysisCard from "@/components/analytics/BottleneckAnalysisCard";
import WorkloadAnalysisCard from "@/components/analytics/WorkloadAnalysisCard";
import ResourcePredictionCard from "@/components/analytics/ResourcePredictionCard";
import ProductivityAnalysisCard from "@/components/analytics/ProductivityAnalysisCard";

const AIInsightsPage = () => {

    /*
    =====================================================
    PARAMS
    =====================================================
    */

    const {

        projectId

    } = useParams();

    /*
    =====================================================
    HOOK
    =====================================================
    */

    const {

        loading,

        error,

        executiveSummary,

        projectHealth,

        projectAnalysis,

        deadlinePrediction,

        riskAnalysis,

        bottleneckAnalysis,

        workloadAnalysis,

        resourcePrediction,

        productivityAnalysis

    } = useAnalytics(

        projectId

    );

    /*
    =====================================================
    LOADING
    =====================================================
    */

    if (loading) {

        return (

            <div className="flex h-[80vh] items-center justify-center">

                <div

                    className="h-14 w-14 animate-spin rounded-full border-4 border-t-transparent"

                    style={{

                        borderColor:
                            "rgba(167,139,250,.25)",

                        borderTopColor:
                            theme.primary

                    }}

                />

            </div>

        );

    }

    /*
    =====================================================
    ERROR
    =====================================================
    */

    if (error) {

        return (

            <div

                className="flex h-[80vh] items-center justify-center text-xl"

                style={{

                    color:
                        theme.text

                }}

            >

                Failed to load AI Insights.

            </div>

        );

    }

    /*
    =====================================================
    UI
    =====================================================
    */

    return (

        <main className="space-y-8">

            <ExecutiveSummaryCard

                data={executiveSummary}

            />

            <ProjectHealthCard

                data={projectHealth}

            />

            <ProjectAnalysisCard

                data={projectAnalysis}

            />

            <DeadlinePredictionCard

                data={deadlinePrediction}

            />

            <RiskAnalysisCard

                data={riskAnalysis}

            />

            <BottleneckAnalysisCard

                data={bottleneckAnalysis}

            />

            <WorkloadAnalysisCard

                data={workloadAnalysis}

            />

            <ResourcePredictionCard

                data={resourcePrediction}

            />

            <ProductivityAnalysisCard

                data={productivityAnalysis}

            />

        </main>

    );

};

export default AIInsightsPage;