import { ObjectId } from 'mongodb';

import Conversation from '../../../db/models/Conversation.model';
import summarifyError from '../../lib/error';
import { generateMeta } from '../../lib/pagination';
import { IConversation, OConversation } from '../interfaces/conversation.intf';

const getConversations = async ({
  limit = 10,
  page = 1,
  query = {},
  sort = { createdAt: 'desc' },
  sender,
  documentId,
  userId,
}: {
  query: any;
  page?: number;
  limit?: number;
  sort?: Record<any, any>;
  sender?: string;
  userId: ObjectId | string;
  documentId: ObjectId | string;
}) => {
  const revampedSearchQuery = {
    createdBy: userId,
    document: documentId,
    ...(sender ? { sender } : {}),
    ...query,
  };

  const count = await Conversation.count(revampedSearchQuery);
  const conversations = await Conversation.find(revampedSearchQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort);

  return { conversations, meta: generateMeta(page, count, limit) };
};

const getConversation = async (query: any) => {
  const conversation = await Conversation.findOne(query);
  return conversation;
};

const createConversation = async (conversationDetails: IConversation) => {
  const conversation = await Conversation.create(conversationDetails);
  conversation.save();
  return conversation;
};

const createMultipleConversations = async (conversationDetails: IConversation[]) => {
  const conversations = await Conversation.insertMany(conversationDetails);
  return conversations;
};

const updateConversation = async ({
  query,
  conversationDetails,
}: {
  query: any;
  conversationDetails: Partial<OConversation>;
}) => {
  const conversation = await getConversation(query);
  if (!conversation) throw new summarifyError('No conversation with that id exists.', 404);

  const updatedConversation = await Conversation.findOneAndUpdate(query, conversationDetails, {
    new: true,
  });
  return updatedConversation;
};

const deleteConversation = async (id: ObjectId | string) => {
  const conversation = await getConversation({ _id: id });
  if (!conversation)
    throw new summarifyError(
      'No conversation with that id exists or conversation does not belong to your organization.',
      404
    );
  await Conversation.deleteOne({ _id: id });
};

const countConversations = async (query: any) => {
  const conversations = await Conversation.count(query);
  return conversations;
};

const ConversationService = {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  countConversations,
  createMultipleConversations,
};
export default ConversationService;
