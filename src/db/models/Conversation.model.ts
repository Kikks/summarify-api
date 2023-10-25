import mongoose, { Document, Schema } from 'mongoose';

import { OConversation } from '../../api/resources/interfaces/conversation.intf';

const ConversationSchema = new Schema<OConversation & Document>(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    document: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', ConversationSchema);

export default Conversation;
