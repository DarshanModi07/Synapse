import { Router } from 'express';
import authRouter from './auth.route.js';
import userRouter from "./user.route.js"
import workspaceRouter from "./workspace.route.js"
import notificationRouter from './notification.route.js';
import departmentRouter from "./department.route.js"
import teamRouter from "./team.route.js"
import projectRouter from "./project.route.js"
import projectTeamRouter from "./projectTeam.route.js"
import projectDepartmentRouter from "./projectDepartment.route.js"
import projectTaskRouter from "./task.route.js"
import projectSubTaskRouter from "./subtask.route.js"
import projectWorkItemRouter from "./workItem.route.js"

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

export default router;