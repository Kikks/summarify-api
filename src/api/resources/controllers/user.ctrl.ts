import { Request, Response } from 'express';
import { SortOrder } from 'mongoose';

import { SUCCESSFUL } from '../../lib/constants';
import summarifyError from '../../lib/error';
import { failure, success } from '../../lib/response';
import UserService from '../services/user.svc';
import { validateUpdateUserInputs } from '../validators/user.vld';

const handleGetUser = async (req: Request, res: Response) => {
  try {
    const userObject: any = res.locals.user;
    const admin = await UserService.getUser({ _id: userObject?.id });

    if (!admin) throw new summarifyError('User not found', 404);

    return success({
      res,
      data: admin,
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error: any) {
    console.error(error);
    return failure({
      res,
      message: error.message || 'An error occured while getting user.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

const handleGetUsers = async (req: Request, res: Response) => {
  try {
    const search = (req.query?.search || '') as string;
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const sortBy = (req.query?.sortBy || 'name') as string;
    const orderBy = (req.query.orderBy || 'desc') as SortOrder;

    const users = await UserService.getUsers({
      search,
      query: {},
      page: Number(page),
      limit: Number(limit),
      sort: { [sortBy]: orderBy },
    });

    return success({
      res,
      data: users,
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error) {
    return failure({
      res,
      message: error.message || 'An error occured while getting users.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

const handleUpdateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName } = validateUpdateUserInputs(req, res);

    const userObject: any = res.locals.user;
    const user = await UserService.updateUser({
      query: { _id: userObject?._id },
      userDetails: { firstName, lastName },
    });

    if (!user) throw new summarifyError('User not found', 404);

    return success({
      res,
      data: user,
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error: any) {
    return failure({
      res,
      message: error.message || 'An error occured while updating user.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

export { handleGetUser, handleGetUsers, handleUpdateUser };
