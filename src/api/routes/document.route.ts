import Router from 'express-promise-router';

import { checkUser } from '../middlewares/auth';
import {
  handleCreateDocument,
  handleCreateDocumentConversation,
  handleDeleteDocument,
  handleGetDocument,
  handleGetDocumentConversations,
  handleGetDocuments,
  handleUpdateDocument,
} from '../resources/controllers/document.ctrl';

const router = Router();

router.route('/:id').get(checkUser, handleGetDocument);
router.route('/').get(checkUser, handleGetDocuments);
router.route('/').post(checkUser, handleCreateDocument);
router.route('/:id').patch(checkUser, handleUpdateDocument);
router.route('/:id').delete(checkUser, handleDeleteDocument);
router.route('/:id/conversations').get(checkUser, handleGetDocumentConversations);
router.route('/:id/conversations').post(checkUser, handleCreateDocumentConversation);

export default router;
