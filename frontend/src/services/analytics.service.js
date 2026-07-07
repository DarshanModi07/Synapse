import api from "@/api/axios";

/*
|--------------------------------------------------------------------------
| Project Analysis
|--------------------------------------------------------------------------
*/

export const getProjectAnalysis = async (
    projectId
) => {

    const response = await api.post(
        `/analytics/${projectId}/project-analysis`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Project Health
|--------------------------------------------------------------------------
*/

export const getProjectHealth = async (
    projectId
) => {

    const response = await api.post(
        `/analytics/${projectId}/project-health`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Risk Analysis
|--------------------------------------------------------------------------
*/

export const getRiskAnalysis = async (
    projectId
) => {

    const response = await api.post(
        `/analytics/${projectId}/risk-analysis`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Deadline Prediction
|--------------------------------------------------------------------------
*/

export const getDeadlinePrediction = async (
    projectId
) => {

    const response = await api.post(
        `/analytics/${projectId}/deadline-prediction`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Workload Analysis
|--------------------------------------------------------------------------
*/

export const getWorkloadAnalysis = async (
    projectId
) => {

    const response = await api.post(
        `/analytics/${projectId}/workload-analysis`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Resource Prediction
|--------------------------------------------------------------------------
*/

export const getResourcePrediction = async (
    projectId
) => {

    const response = await api.post(
        `/analytics/${projectId}/resource-prediction`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Productivity Analysis
|--------------------------------------------------------------------------
*/

export const getProductivityAnalysis = async (
    projectId
) => {

    const response = await api.post(
        `/analytics/${projectId}/productivity-analysis`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Bottleneck Analysis
|--------------------------------------------------------------------------
*/

export const getBottleneckAnalysis = async (
    projectId
) => {

    const response = await api.post(
        `/analytics/${projectId}/bottleneck-analysis`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Executive Summary
|--------------------------------------------------------------------------
*/

export const getExecutiveSummary = async (
    projectId
) => {

    const response = await api.post(
        `/analytics/${projectId}/executive-summary`
    );

    return response.data;

};