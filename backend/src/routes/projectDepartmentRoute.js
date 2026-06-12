import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { assignDepartment, getDepartments, removeDepartment } from "../Controller/projectDepartmentController.js";

const router = Router()

router.post("/:projectId/department",authMiddleware,assignDepartment)
router.get("/:projectId/departments",authMiddleware,getDepartments)
router.delete("/project/:projectId/department/:departmentId",authMiddleware,removeDepartment)


export default router