import { Router } from 'express';
import { createWorkSpace,getUserWorkSpaces,getWorkspace,inviteUser , acceptInvite,rejectInvite,getWorkspaceMembers,removeMember,changeRole, ownerDashboard} from '../Controller/workSpaceController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/createWorkspace', authMiddleware , createWorkSpace);
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