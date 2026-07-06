import {
    useEffect,
    useState
} from "react";

import { useParams } from "react-router-dom";

import { theme } from "@/lib/theme";

import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useProjects } from "@/hooks/useProjects";
import { useAnalytics } from "@/hooks/useAnalytics";

import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import ProjectSelector from "@/components/analytics/ProjectSelector";

import ProjectAnalysisCard from "@/components/analytics/ProjectAnalysisCard";
import ProjectHealthCard from "@/components/analytics/ProjectHealthCard";
import RiskAnalysisCard from "@/components/analytics/RiskAnalysisCard";
import DeadlinePredictionCard from "@/components/analytics/DeadlinePredictionCard";
import WorkloadAnalysisCard from "@/components/analytics/WorkloadAnalysisCard";
import ResourcePredictionCard from "@/components/analytics/ResourcePredictionCard";
import ProductivityAnalysisCard from "@/components/analytics/ProductivityAnalysisCard";
import BottleneckAnalysisCard from "@/components/analytics/BottleneckAnalysisCard";
import ExecutiveSummaryCard from "@/components/analytics/ExecutiveSummaryCard";

const AnalyticsPage = () => {

    const { slug } = useParams();

    /*
    =====================================================
    WORKSPACE
    =====================================================
    */

    const {

        workspaces,

        loading: workspaceLoading

    } = useWorkspaces();

    const workspaceMember = workspaces.find(

        item => item.workspace.slug === slug

    );

    const workspaceId =
        workspaceMember?.workspace?.id;

    /*
    =====================================================
    PROJECTS
    =====================================================
    */

    const {

        projects,

        loading: projectLoading

    } = useProjects(
        workspaceId
    );

    /*
    =====================================================
    SELECTED PROJECT
    =====================================================
    */

    const [

        selectedProject,

        setSelectedProject

    ] = useState("");

    useEffect(() => {

        if (

            projects.length > 0 &&

            !selectedProject

        ) {

            setSelectedProject(

                projects[0].id

            );

        }

    }, [

        projects,

        selectedProject

    ]);

    /*
    =====================================================
    ANALYTICS
    =====================================================
    */

    const {

        loading,

        error,

        refresh,

        analysis,

        health,

        risk,

        deadline,

        workload,

        resources,

        productivity,

        bottlenecks,

        summary

    } = useAnalytics(

        selectedProject

    );

    /*
    =====================================================
    LOADING
    =====================================================
    */

    if (

        workspaceLoading ||

        projectLoading ||

        loading

    ) {

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

                className="flex h-[80vh] items-center justify-center"

                style={{

                    color: theme.text

                }}

            >

                {error}

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

            <AnalyticsHeader

                refresh={refresh}

            />

            <ProjectSelector

                projects={projects}

                selectedProject={selectedProject}

                setSelectedProject={setSelectedProject}

            />

            <ProjectAnalysisCard

                data={analysis}

            />

            <ProjectHealthCard

                data={health}

            />

            <RiskAnalysisCard

                data={risk}

            />

            <DeadlinePredictionCard

                data={deadline}

            />

            <WorkloadAnalysisCard

                data={workload}

            />

            <ResourcePredictionCard

                data={resources}

            />

            <ProductivityAnalysisCard

                data={productivity}

            />

            <BottleneckAnalysisCard

                data={bottlenecks}

            />

            <ExecutiveSummaryCard

                data={summary}

            />

        </main>

    );

};

export default AnalyticsPage;