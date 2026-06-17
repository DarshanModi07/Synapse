import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { assignDepartment, getDepartments, managerDashboard, progressDepartment, removeDepartment } from "../Controller/projectDepartmentController.js";

const router = Router()

router.post("/:projectId/department",authMiddleware,assignDepartment)
router.get("/:projectId/departments",authMiddleware,getDepartments)
router.delete("/project/:projectId/department/:departmentId",authMiddleware,removeDepartment)
router.get('/:projectDepartmentId/progress',authMiddleware,progressDepartment)
router.get('/:projectDepartmentId/dashboard',authMiddleware,managerDashboard)


export default router