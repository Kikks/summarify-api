import { ObjectId } from 'mongodb';

import User from '../../../db/models/User.model';
import summarifyError from '../../lib/error';
import { generateMeta } from '../../lib/pagination';
import { IUser, OUser, RegisterUserParams } from '../interfaces/user.intf';
import { isEmpty } from '../utils/validation';

const getUsers = async ({
  limit = 10,
  page = 1,
  query = {},
  search,
  sort = { name: 'acs' },
}: {
  query: any;
  page?: number;
  limit?: number;
  search?: string;
  sort?: Record<any, any>;
}) => {
  const revampedSearchQuery = {
    ...(search
      ? {
          firstName: { $regex: isEmpty(search) ? '' : `.*${search}*.`, $options: 'i' },
          lastName: { $regex: isEmpty(search) ? '' : `.*${search}*.`, $options: 'i' },
        }
      : {}),
    ...query,
  };

  const count = await User.count(revampedSearchQuery);
  const users = await User.find(revampedSearchQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort);

  return { users, meta: generateMeta(page, count, limit) };
};

const getUser = async (query: any) => {
  const user = await User.findOne(query);
  return user;
};

const createUser = async (userDetails: IUser) => {
  const existingUser = await getUser({ email: userDetails?.email });
  if (existingUser) throw new summarifyError('A user with that email already exists.', 409);

  const user = await User.create(userDetails);
  user.save();
  return user;
};

const updateUser = async ({ query, userDetails }: { query: any; userDetails: Partial<OUser> }) => {
  const user = await getUser(query);
  if (!user) throw new summarifyError('No user with that id exists.', 404);

  if (userDetails?.firstName) user.firstName = userDetails.firstName;
  if (userDetails?.lastName) user.lastName = userDetails.lastName;
  if (userDetails?.email) user.email = userDetails.email;
  if (userDetails?.image) user.image = userDetails.image;

  await user.save();

  return user;
};

const deleteUser = async (id: ObjectId) => {
  const user = await getUser({ _id: id });
  if (!user)
    throw new summarifyError(
      'No user with that id exists or user does not belong to your organization.',
      404
    );
  await User.deleteOne({ _id: id });
};

const countUsers = async (query: any) => {
  const users = await User.count(query);
  return users;
};

const register = async ({ userDetails, password }: RegisterUserParams) => {
  const existingUser = await getUser({ email: userDetails?.email });
  if (existingUser) throw new summarifyError('A user with that email already exists.', 409);

  const user = await User.register(
    new User({
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      image: userDetails.image,
    }),
    password
  );
  return user;
};

const UserService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  countUsers,
  register,
};
export default UserService;
