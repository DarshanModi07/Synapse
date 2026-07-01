import { Router } from 'express';
import {
    createDepartment,
    deleteDepartment,
    getAllDepartment,
    getAvailableManagers,
    getDepartmentById,
    updateDepartment,
    departmentDashboard
} from "../controllers/department.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router();

router.post("/createDepartment",authMiddleware,createDepartment)
router.get("/:workspaceId/departments",authMiddleware,getAllDepartment)
router.patch("/:departmentId/update",authMiddleware,updateDepartment)
router.delete("/:departmentId/delete",authMiddleware,deleteDepartment)
router.get("/:departmentId",authMiddleware,getDepartmentById);
router.get("/:departmentId/available-managers",authMiddleware,getAvailableManagers);
router.get("/:departmentId/dashboard",authMiddleware,departmentDashboard);

export default router;