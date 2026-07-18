import { Router } from "express";
import { 
    getEmployeeDashboard,
    getEmployeeTasks,
    getEmployeeAnalytics,
    updateEmployeeItemStatus
} from "../controllers/employee.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/dashboard", authMiddleware, getEmployeeDashboard);
router.get("/tasks", authMiddleware, getEmployeeTasks);
router.get("/analytics", authMiddleware, getEmployeeAnalytics);

// Route for updating status of tasks/subtasks/workitems
router.put("/:type/:itemId/status", authMiddleware, updateEmployeeItemStatus);

export default router;
