import Router from 'express-promise-router';

import { checkUser } from '../middlewares/auth';
import {
  handleChangePassword,
  handleLogin,
  handleRegister,
} from '../resources/controllers/auth.ctrl';

const router = Router();

router.route('/login').post(handleLogin);
router.route('/register').post(handleRegister);
router.route('/change-password').post(checkUser, handleChangePassword);

export default router;
