import { ObjectId } from 'mongodb';

export interface OUser {
  _id?: ObjectId;
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
}

export interface RegisterUserParams {
  userDetails: IUser;
  password: string;
}
