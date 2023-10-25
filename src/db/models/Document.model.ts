import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';

import { ODocument } from '../../api/resources/interfaces/document.intf';

const DocumentSchema = new Schema<ODocument & MongooseDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    fileType: {
      type: String,
    },
    image: {
      type: String,
    },
    summary: {
      type: Schema.Types.ObjectId,
      ref: 'Summary',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Document = mongoose.model('Document', DocumentSchema);

export default Document;
