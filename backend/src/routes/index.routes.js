import { Router } from 'express';
import authRouter from './auth.routes.js';
import userRouter from "./user.routes.js"
import workspaceRouter from "./workspace.routes.js"
import notificationRouter from './notification.routes.js';
import departmentRouter from "./department.routes.js"
import teamRouter from "./team.routes.js"
import projectRouter from "./project.routes.js"
import projectTeamRouter from "./projectTeam.routes.js"
import projectDepartmentRouter from "./projectDepartment.routes.js"
import projectTaskRouter from "./task.routes.js"
import projectSubTaskRouter from "./subtask.routes.js"
import projectWorkItemRouter from "./workItem.routes.js"
import aiRouter from "./ai.routes.js"
import chatRouter from "./chat.routes.js"
import analyticsRouter from "./analytics.routes.js";
import managerRouter from "./manager.routes.js";
import teamLeadRouter from "./teamLead.routes.js";
import teamLeadProjectRouter from "./teamLeadProject.routes.js";

const router = Router();

router.use('/api/auth', authRouter);
router.use('/api/users', userRouter);
router.use('/api/workspace', workspaceRouter);
router.use('/api/notification', notificationRouter)
router.use('/api/department',departmentRouter)
router.use('/api/team',teamRouter)
router.use('/api/project',projectRouter)
router.use('/api/project-team/',projectTeamRouter)
router.use('/api/project-department/',projectDepartmentRouter)
router.use('/api/project-team-task/',projectTaskRouter)
router.use('/api/project-team-subtask/',projectSubTaskRouter)
router.use('/api/work-item/',projectWorkItemRouter)
router.use('/api/chat/',chatRouter)
router.use("/api/analytics", analyticsRouter);
router.use('/api/ai',aiRouter)
router.use('/api/manager', managerRouter)
router.use('/api/team-lead', teamLeadRouter)
router.use('/api/team-lead/projects', teamLeadProjectRouter)


export default router;