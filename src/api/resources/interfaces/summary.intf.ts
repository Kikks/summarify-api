import { Document, ObjectId } from 'mongodb';
import { PopulatedDoc } from 'mongoose';

import { OUser } from './user.intf';

export interface OSummary {
  _id?: ObjectId;
  content: string;
  createdBy: ObjectId | PopulatedDoc<OUser & Document>;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
}

export interface ISummary {
  content: string;
  createdBy: ObjectId | string;
}
