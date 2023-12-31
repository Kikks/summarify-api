import { Request, Response } from 'express';
import { SortOrder } from 'mongoose';

import { addSummarizeJobToQueue, queryDocument } from '../../../clients/da';
import { SUCCESSFUL } from '../../lib/constants';
import summarifyError from '../../lib/error';
import { failure, success } from '../../lib/response';
import { ODocument } from '../interfaces/document.intf';
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

    const document = await DocumentService.createDocument({
      title,
      content,
      fileType,
      createdBy: user._id,
      summaryStatus: 'pending',
      ...(image ? { image } : {}),
    });

    try {
      const queued = await addSummarizeJobToQueue({
        documentId: document._id,
        text: document.content,
        userId: user._id,
      });

      if (!queued) {
        await DocumentService.updateDocument({
          query: { _id: document._id },
          documentDetails: { summaryStatus: 'failed' },
        });
      }
    } catch (error) {
      console.log({ error });
      await DocumentService.updateDocument({
        query: { _id: document._id },
        documentDetails: { summaryStatus: 'failed' },
      });
    }

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

const handleGenerateSummary = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const id = req.params.id;

    const document = await DocumentService.getDocument({ _id: id, createdBy: user._id });
    if (!document) throw new summarifyError('Document not found', 404);
    if (document?.summary) throw new summarifyError('Document already summarized', 400);

    let updatedDocument: ODocument | null;
    try {
      const queued = await addSummarizeJobToQueue({
        documentId: document._id,
        text: document.content,
        userId: user._id,
      });

      updatedDocument = await DocumentService.updateDocument({
        query: { _id: document._id },
        documentDetails: { summaryStatus: queued ? 'pending' : 'failed' },
      });
    } catch (error) {
      console.log({ error });
      updatedDocument = await DocumentService.updateDocument({
        query: { _id: document._id },
        documentDetails: { summaryStatus: 'failed' },
      });
    }

    return success({
      res,
      data: updatedDocument,
      message: SUCCESSFUL,
      httpCode: 200,
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
      message: error.message || 'An error occured while generating document summary.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

const handleSummaryCreationWebhook = async (req: Request, res: Response) => {
  try {
    const { documentId, summary, userId } = req.body;
    const document = await DocumentService.getDocument({ _id: documentId });
    if (!document) throw new summarifyError('Document not found', 404);

    const summaryObject = await SummaryService.createSummary({
      content: summary,
      createdBy: userId,
    });

    const updatedDocument = await DocumentService.updateDocument({
      query: { _id: documentId },
      documentDetails: { summary: summaryObject._id, summaryStatus: 'completed' },
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
      message: error.message || 'An error occured while creating document summary.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

const handleSummaryFailedWebhook = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.body;
    const document = await DocumentService.getDocument({ _id: documentId });
    if (!document) throw new summarifyError('Document not found', 404);

    const updatedDocument = await DocumentService.updateDocument({
      query: { _id: documentId },
      documentDetails: { summaryStatus: 'failed' },
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
      message: error.message || 'An error occured while updating document failed summary status.',
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
  handleGenerateSummary,
  handleGetDocumentConversations,
  handleCreateDocumentConversation,
  handleSummaryCreationWebhook,
  handleSummaryFailedWebhook,
};
