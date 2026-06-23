import express from "express";
import {
    projectAnalysis,
    projectHealth,
    projectRiskAnalysis,
    deadlinePrediction,
    workloadAnalysis,
    resourcePrediction,
    productivityAnalysis,
    bottleneckAnalysis,
    executiveSummary
} from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:projectId/project-analysis", authMiddleware, projectAnalysis);
router.post("/:projectId/project-health", authMiddleware, projectHealth);
router.post("/:projectId/risk-analysis", authMiddleware, projectRiskAnalysis);
router.post("/:projectId/deadline-prediction", authMiddleware, deadlinePrediction);
router.post("/:projectId/workload-analysis", authMiddleware, workloadAnalysis);
router.post("/:projectId/resource-prediction", authMiddleware, resourcePrediction);
router.post("/:projectId/productivity-analysis", authMiddleware, productivityAnalysis);
router.post("/:projectId/bottleneck-analysis", authMiddleware, bottleneckAnalysis);
router.post("/:projectId/executive-summary", authMiddleware, executiveSummary);

export default router;