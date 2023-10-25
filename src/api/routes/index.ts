import * as express from 'express';

import authRouter from './auth.route';
import documentRouter from './document.route';
import statsRouter from './stats.route';
import userRouter from './user.route';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/documents', documentRouter);
router.use('/stats', statsRouter);
router.use('/users', userRouter);

export default router;
