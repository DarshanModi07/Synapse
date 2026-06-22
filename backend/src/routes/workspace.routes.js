import { Router } from 'express';
import { createWorkSpace,getUserWorkSpaces,getWorkspace,inviteUser , acceptInvite,rejectInvite,getWorkspaceMembers,removeMember,changeRole, ownerDashboard} from '../controllers/workSpace.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.post('/createWorkspace',authMiddleware,upload.single("logo"),createWorkSpace);
router.post('/inviteUser', authMiddleware , inviteUser);
router.get('/getUserWorkSpaces', authMiddleware , getUserWorkSpaces);
router.get('/:slug', authMiddleware , getWorkspace);
router.get('/:workspaceId/dashboard', authMiddleware , ownerDashboard);
router.post("/accept/:token", authMiddleware , acceptInvite)
router.post("/reject/:token", authMiddleware , rejectInvite)
router.get("/:workspaceId/members",authMiddleware,getWorkspaceMembers)
router.delete("/:workspaceId/member/:userId",authMiddleware,removeMember)
router.patch('/:workspaceId/member/:userId/role',authMiddleware,changeRole)

export default router;