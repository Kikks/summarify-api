import { Document, ObjectId } from 'mongodb';
import { PopulatedDoc } from 'mongoose';

import { OSummary } from './summary.intf';
import { OUser } from './user.intf';

export interface ODocument {
  _id?: ObjectId;
  title: string;
  image?: string;
  content: string;
  fileType?: string;
  summary?: ObjectId | PopulatedDoc<OSummary & Document>;
  createdBy: ObjectId | PopulatedDoc<OUser & Document>;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
}

export interface IDocument {
  title: string;
  image?: string;
  content: string;
  fileType?: string;
  summary?: ObjectId | string;
  createdBy: ObjectId | string;
}
