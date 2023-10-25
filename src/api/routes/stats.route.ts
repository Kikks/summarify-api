import Router from 'express-promise-router';

import { checkUser } from '../middlewares/auth';
import { handleGetStats } from '../resources/controllers/stats.ctrl';

const router = Router();

router.route('/').get(checkUser, handleGetStats);

export default router;
