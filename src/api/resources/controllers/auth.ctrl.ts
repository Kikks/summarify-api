import { Request, Response } from 'express';
import passport from 'passport';

import { SUCCESSFUL } from '../../lib/constants';
import { failure, success } from '../../lib/response';
import { generateToken } from '../../lib/token';
import { OUser } from '../interfaces/user.intf';
import UserService from '../services/user.svc';
import { validateLoginInputs, validateRegisterInputs } from '../validators/auth.vld';

const handleRegister = async (req: Request, res: Response) => {
  try {
    const authData = validateRegisterInputs(req, res);
    const user = await UserService.register({
      userDetails: authData,
      password: authData.password,
    });

    return success({
      res,
      data: user,
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error: any) {
    return failure({
      res,
      message: error.message || 'An error occured while registering user.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

const handleLogin = async (req: Request, res: Response) => {
  try {
    validateLoginInputs(req, res);
    return passport.authenticate('local', function (err: any, user: OUser) {
      if (err) {
        return failure({
          res,
          message: err,
          httpCode: 500,
        });
      }

      if (!user) {
        return failure({
          res,
          message: 'Email or password is incorrect',
          httpCode: 401,
        });
      }

      return success({
        res,
        data: {
          user,
          token: generateToken({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          }),
        },
        message: SUCCESSFUL,
        httpCode: 200,
      });
    })(req, res);
  } catch (error: any) {
    return failure({
      res,
      message: error.message || 'An error occured while logging admin in.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

export { handleRegister, handleLogin };
