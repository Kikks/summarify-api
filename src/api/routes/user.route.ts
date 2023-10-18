import Router from 'express-promise-router';

import { checkUser } from '../middlewares/auth';
import { handleGetUser } from '../resources/controllers/user.ctrl';

const router = Router();

router.route('/self').get(checkUser, handleGetUser);

export default router;
