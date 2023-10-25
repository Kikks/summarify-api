import { Request, Response } from 'express';
import { SortOrder } from 'mongoose';
import { queryDocument, summarizeText } from 'src/clients/da';

import { SUCCESSFUL } from '../../lib/constants';
import summarifyError from '../../lib/error';
import { failure, success } from '../../lib/response';
import ConversationService from '../services/conversation.svc';
import DocumentService from '../services/document.svc';
import SummaryService from '../services/summary.svc';
import { generateImage } from '../utils/imageGenererator';
import {
  validateCreateDocumentConversationInputs,
  validateCreateDocumentInputs,
  validateUpdateDocumentInputs,
} from '../validators/document.vld';

const handleGetDocument = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = res.locals.user;
    const document = await DocumentService.getDocument({ _id: id, createdBy: user._id });
    if (!document) throw new summarifyError('Document not found', 404);

    return success({
      res,
      data: document,
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error: any) {
    return failure({
      res,
      message: error.message || 'An error occured while getting document.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

const handleGetDocuments = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    const search = (req.query?.search || '') as string;
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const sortBy = (req.query?.sortBy || 'createdAt') as string;
    const orderBy = (req.query.orderBy || 'desc') as SortOrder;

    const documents = await DocumentService.getDocuments({
      search,
      query: {},
      page: Number(page),
      limit: Number(limit),
      sort: { [sortBy]: orderBy },
      userId: user._id,
    });

    return success({
      res,
      data: documents,
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error) {
    return failure({
      res,
      message: error.message || 'An error occured while getting documents.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

const handleCreateDocument = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { title, content, fileType } = validateCreateDocumentInputs(req, res);
    const image = await generateImage();

    const summaryText = await summarizeText(content);
    const summary = await SummaryService.createSummary({
      content: summaryText,
      createdBy: user._id,
    });

    const document = await DocumentService.createDocument({
      title,
      content,
      fileType,
      createdBy: user._id,
      ...(summary ? { summary: summary._id } : {}),
      ...(image ? { image } : {}),
    });

    return success({
      res,
      data: document,
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error) {
    console.log({ error });
    return failure({
      res,
      message: error.message || 'An error occured while creating document.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

const handleUpdateDocument = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const value = validateUpdateDocumentInputs(req, res);

    const updatedDocument = await DocumentService.updateDocument({
      query: { _id: id },
      documentDetails: value,
    });

    return success({
      res,
      data: updatedDocument,
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error) {
    return failure({
      res,
      message: error.message || 'An error occured while updating document.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

const handleDeleteDocument = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await DocumentService.deleteDocument(id);

    return success({
      res,
      data: 'Document deleted successfully.',
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error) {
    return failure({
      res,
      message: error.message || 'An error occured while deleting document.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

const handleGetDocumentConversations = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const id = req.params.id;

    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const sortBy = (req.query?.sortBy || 'createdAt') as string;
    const orderBy = (req.query.orderBy || 'desc') as SortOrder;

    const conversations = await ConversationService.getConversations({
      query: {},
      page: Number(page),
      limit: Number(limit),
      sort: { [sortBy]: orderBy },
      userId: user._id,
      documentId: id,
    });

    return success({
      res,
      data: conversations,
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error) {
    return failure({
      res,
      message: error.message || 'An error occured while getting document conversations.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

const handleCreateDocumentConversation = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const id = req.params.id;

    const { content } = validateCreateDocumentConversationInputs(req, res);
    const document = await DocumentService.getDocument({ _id: id, createdBy: user._id });
    if (!document) throw new summarifyError('Document not found', 404);

    const response = await queryDocument(content, document.content);

    const conversations = await ConversationService.createMultipleConversations([
      {
        content,
        sender: 'user',
        document: id,
        createdBy: user._id,
      },
      {
        content: response,
        sender: 'ai',
        document: id,
        createdBy: user._id,
      },
    ]);

    return success({
      res,
      data: conversations,
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error) {
    return failure({
      res,
      message: error.message || 'An error occured while creating document conversation.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

export {
  handleGetDocument,
  handleGetDocuments,
  handleUpdateDocument,
  handleCreateDocument,
  handleDeleteDocument,
  handleGetDocumentConversations,
  handleCreateDocumentConversation,
};
