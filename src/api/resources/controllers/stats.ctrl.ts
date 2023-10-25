import { Request, Response } from 'express';

import { SUCCESSFUL } from '../../lib/constants';
import { failure, success } from '../../lib/response';
import ConversationService from '../services/conversation.svc';
import DocumentService from '../services/document.svc';
import SummaryService from '../services/summary.svc';

const handleGetStats = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    const documents = await DocumentService.countDocuments({ createdBy: user._id });
    const summaries = await SummaryService.countSummaries({ createdBy: user._id });
    const questionsAnswered = await ConversationService.countConversations({
      createdBy: user._id,
      sender: 'ai',
    });

    return success({
      res,
      data: {
        documents,
        summaries,
        questionsAnswered,
      },
      message: SUCCESSFUL,
      httpCode: 200,
    });
  } catch (error: any) {
    return failure({
      res,
      message: error.message || 'An error occured while getting user statistics.',
      errStack: error.stack,
      httpCode: error.code || 500,
    });
  }
};

export { handleGetStats };
