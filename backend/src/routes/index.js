import { Router } from 'express';
import authRouter from './authRoute.js';
import userRouter from "./userRoute.js"
import workspaceRouter from "./workspaceRoute.js"
import notificationRouter from './notificationRoute.js';
import departmentRouter from "./departmentRoute.js"
import teamRouter from "./teamRoute.js"

const router = Router();

router.use('/api/auth', authRouter);
router.use('/api/users', userRouter);
router.use('/api/workspace', workspaceRouter);
router.use('/api/notification', notificationRouter)
router.use('/api/department',departmentRouter)
router.use('/api/team',teamRouter)

export default router;