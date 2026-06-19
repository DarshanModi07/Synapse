import { Router } from 'express';
import { createDepartment , deleteDepartment, getAllDepartment, updateDepartment} from '../controllers/department.controller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router();

router.post("/createDepartment",authMiddleware,createDepartment)
router.get("/:workspaceId/departments",authMiddleware,getAllDepartment)
router.patch("/:departmentId/update",authMiddleware,updateDepartment)
router.delete("/:departmentId/delete",authMiddleware,deleteDepartment)


export default router;