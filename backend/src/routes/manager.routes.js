import { Router } from 'express';
import { 
    getMyDepartments, 
    getManagerDepartmentDashboard,
    createManagerTeam,
    updateManagerTeam,
    deleteManagerTeam,
    addManagerTeamMember,
    removeManagerTeamMember,
    getManagerTeamDashboard,
    getManagerAvailableLeaders,
    getAllManagerTeams,
    getAllMyManagerTeams,
    suggestManagerTeams,
    managerProjectDashboard,
    getAllManagerProjects,
    generateManagerProjectTasksAI,
    approveManagerProjectTasks,
    getManagerTeamMembers,
    getManagerWorkspaceMembers
} from "../controllers/manager.controller.js";
import { getManagerAnalytics } from "../controllers/managerAnalytics.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:workspaceId/departments", authMiddleware, getMyDepartments);
router.get("/:workspaceId/teams", authMiddleware, getAllMyManagerTeams);
router.get("/:workspaceId/projects", authMiddleware, getAllManagerProjects);
router.get("/:workspaceId/members", authMiddleware, getManagerWorkspaceMembers);
router.get("/analytics", authMiddleware, getManagerAnalytics);
router.get("/projects/:projectId/dashboard", authMiddleware, managerProjectDashboard);
router.post("/projects/:projectId/ai-tasks", authMiddleware, generateManagerProjectTasksAI);
router.post("/projects/:projectId/bulk-tasks", authMiddleware, approveManagerProjectTasks);
router.get("/departments/:departmentId/dashboard", authMiddleware, getManagerDepartmentDashboard);

// Manager Department Teams
router.get("/departments/:departmentId/teams", authMiddleware, getAllManagerTeams);
router.post("/departments/:departmentId/teams/ai-suggest", authMiddleware, suggestManagerTeams);
router.post("/departments/:departmentId/teams/create", authMiddleware, createManagerTeam);
router.patch("/teams/:teamId/update", authMiddleware, updateManagerTeam);
router.delete("/teams/:teamId/delete", authMiddleware, deleteManagerTeam);
router.post("/teams/:teamId/member/add", authMiddleware, addManagerTeamMember);
router.delete("/teams/:teamId/member/delete", authMiddleware, removeManagerTeamMember);
router.get("/teams/:teamId/dashboard", authMiddleware, getManagerTeamDashboard);
router.get("/teams/:teamId/members", authMiddleware, getManagerTeamMembers);
router.get("/departments/:departmentId/available-leaders", authMiddleware, getManagerAvailableLeaders);

export default router;
