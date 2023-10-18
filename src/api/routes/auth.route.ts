import Router from 'express-promise-router';

import { checkUser } from '../middlewares/auth';
import { handleLogin, handleRegister } from '../resources/controllers/auth.ctrl';

const router = Router();

router.route('/login').post(checkUser, handleLogin);
router.route('/admin/login').post(handleLogin);
router.route('/admin/register').post(handleRegister);

export default router;
