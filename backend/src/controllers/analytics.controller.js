import { collectProjectData, buildAnalyticsPayload } from "../ai/dataCollector.js";
import { generateAnalysis } from "../ai/ai.service.js";
import { validateProjectAccess } from "../ai/rbac.validator.js";
import { buildProjectAnalysisPrompt } from "../ai/prompts/projectAnalysis.prompt.js";
import { buildProjectHealthPrompt } from "../ai/prompts/projectHealth.prompt.js";
import { buildRiskAnalysisPrompt } from "../ai/prompts/riskAnalysis.prompt.js";
import { buildDeadlinePredictionPrompt } from "../ai/prompts/deadlinePrediction.prompt.js";
import { buildWorkloadAnalysisPrompt } from "../ai/prompts/workloadAnalysis.prompt.js";
import { buildResourcePredictionPrompt } from "../ai/prompts/resourcePrediction.prompt.js";
import { buildProductivityAnalysisPrompt } from "../ai/prompts/productivityAnalysis.prompt.js";
import { buildBottleneckAnalysisPrompt } from "../ai/prompts/bottleneckAnalysis.prompt.js";
import { buildExecutiveSummaryPrompt } from "../ai/prompts/executiveSummary.prompt.js";

// shared: validate + collect + build payload
const prepareData = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.userId;

    if (!projectId) {
        res.status(400).json({ message: "Project ID required" });
        return null;
    }

    const access = await validateProjectAccess(projectId, userId);
    if (!access.allowed) {
        res.status(access.status).json({ message: access.message });
        return null;
    }

    const project = await collectProjectData(projectId);
    if (!project) {
        res.status(404).json({ message: "Project not found" });
        return null;
    }

    return buildAnalyticsPayload(project);
};

export const projectAnalysis = async (req, res) => {
    try {
        const data = await prepareData(req, res);
        if (!data) return;

        const result = await generateAnalysis(buildProjectAnalysisPrompt(data));

        return res.status(200).json({
            message: "Project analysis generated",
            data: { stats: data, analysis: result }
        });
    } catch (err) {
        return res.status(500).json({ message: "Analysis failed" });
    }
};

export const projectHealth = async (req, res) => {
    try {
        const data = await prepareData(req, res);
        if (!data) return;

        const result = await generateAnalysis(buildProjectHealthPrompt(data));

        return res.status(200).json({
            message: "Health score generated",
            data: { stats: data, health: result }
        });
    } catch (err) {
        return res.status(500).json({ message: "Health analysis failed" });
    }
};

export const projectRiskAnalysis = async (req, res) => {
    try {
        const data = await prepareData(req, res);
        if (!data) return;

        const result = await generateAnalysis(buildRiskAnalysisPrompt(data));

        return res.status(200).json({
            message: "Risk analysis generated",
            data: { stats: data, risks: result }
        });
    } catch (err) {
        return res.status(500).json({ message: "Risk analysis failed" });
    }
};

export const deadlinePrediction = async (req, res) => {
    try {
        const data = await prepareData(req, res);
        if (!data) return;

        const result = await generateAnalysis(buildDeadlinePredictionPrompt(data));

        return res.status(200).json({
            message: "Deadline prediction generated",
            data: { stats: data, prediction: result }
        });
    } catch (err) {
        return res.status(500).json({ message: "Deadline prediction failed" });
    }
};

export const workloadAnalysis = async (req, res) => {
    try {
        const data = await prepareData(req, res);
        if (!data) return;

        const result = await generateAnalysis(buildWorkloadAnalysisPrompt(data));

        return res.status(200).json({
            message: "Workload analysis generated",
            data: { stats: data, workload: result }
        });
    } catch (err) {
        return res.status(500).json({ message: "Workload analysis failed" });
    }
};

export const resourcePrediction = async (req, res) => {
    try {
        const data = await prepareData(req, res);
        if (!data) return;

        const result = await generateAnalysis(buildResourcePredictionPrompt(data));

        return res.status(200).json({
            message: "Resource prediction generated",
            data: { stats: data, resources: result }
        });
    } catch (err) {
        return res.status(500).json({ message: "Resource prediction failed" });
    }
};

export const productivityAnalysis = async (req, res) => {
    try {
        const data = await prepareData(req, res);
        if (!data) return;

        const result = await generateAnalysis(buildProductivityAnalysisPrompt(data));

        return res.status(200).json({
            message: "Productivity analysis generated",
            data: { stats: data, productivity: result }
        });
    } catch (err) {
        return res.status(500).json({ message: "Productivity analysis failed" });
    }
};

export const bottleneckAnalysis = async (req, res) => {
    try {
        const data = await prepareData(req, res);
        if (!data) return;

        const result = await generateAnalysis(buildBottleneckAnalysisPrompt(data));

        return res.status(200).json({
            message: "Bottleneck analysis generated",
            data: { stats: data, bottlenecks: result }
        });
    } catch (err) {
        return res.status(500).json({ message: "Bottleneck analysis failed" });
    }
};

export const executiveSummary = async (req, res) => {
    try {
        const data = await prepareData(req, res);
        if (!data) return;

        const result = await generateAnalysis(buildExecutiveSummaryPrompt(data));

        return res.status(200).json({
            message: "Executive summary generated",
            data: { stats: data, summary: result }
        });
    } catch (err) {
        return res.status(500).json({ message: "Executive summary failed" });
    }
};