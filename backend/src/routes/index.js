import { Router } from 'express';
import authRouter from './authRoute.js';
import userRouter from "./userRoute.js"
import workspaceRouter from "./workspaceRoute.js"
import notificationRouter from './notificationRoute.js';
import departmentRouter from "./departmentRoute.js"
import teamRouter from "./teamRoute.js"
import projectRouter from "./projectRoute.js"
import projectTeamRouter from "./projectTeamRoute.js"
import projectDepartmentRouter from "./projectDepartmentRoute.js"
import projectTask from "./taskRoute.js"

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
router.use('/api/project-team-task/',projectTask)

export default router;