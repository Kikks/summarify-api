import { Document, ObjectId } from 'mongodb';
import { PopulatedDoc } from 'mongoose';

import { ODocument } from './document.intf';
import { OUser } from './user.intf';

export interface OConversation {
  _id?: ObjectId;
  content: string;
  sender: 'user' | 'ai';
  document: ObjectId | PopulatedDoc<ODocument & Document>;
  createdBy: ObjectId | PopulatedDoc<OUser & Document>;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
}

export interface IConversation {
  content: string;
  sender: 'user' | 'ai';
  document: ObjectId | string;
  createdBy: ObjectId | string;
}
