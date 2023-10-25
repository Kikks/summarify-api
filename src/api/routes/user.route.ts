import Router from 'express-promise-router';

import { checkUser } from '../middlewares/auth';
import { handleGetUser, handleUpdateUser } from '../resources/controllers/user.ctrl';

const router = Router();

router.route('/self').get(checkUser, handleGetUser);
router.route('/self').patch(checkUser, handleUpdateUser);

export default router;
