import { ObjectId } from 'mongodb';

import Document from '../../../db/models/Document.model';
import summarifyError from '../../lib/error';
import { generateMeta } from '../../lib/pagination';
import { IDocument, ODocument } from '../interfaces/document.intf';
import { isEmpty } from '../utils/validation';

const getDocuments = async ({
  limit = 10,
  page = 1,
  query = {},
  search,
  sort = { createdAt: 'desc' },
  userId,
}: {
  query: any;
  page?: number;
  limit?: number;
  search?: string;
  sort?: Record<any, any>;
  userId: ObjectId | string;
}) => {
  const revampedSearchQuery = {
    ...(search
      ? {
          title: { $regex: isEmpty(search) ? '' : `.*${search}*.`, $options: 'i' },
        }
      : {}),
    createdBy: userId,
    ...query,
  };

  const count = await Document.count(revampedSearchQuery);
  const documents = await Document.find(revampedSearchQuery)
    .select('title fileType image createdAt')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort);

  return { documents, meta: generateMeta(page, count, limit) };
};

const getDocument = async (query: any) => {
  const document = await Document.findOne(query).populate('summary');
  return document;
};

const createDocument = async (documentDetails: IDocument) => {
  const document = await Document.create(documentDetails);
  document.save();
  return document;
};

const updateDocument = async ({
  query,
  documentDetails,
}: {
  query: any;
  documentDetails: Partial<ODocument>;
}) => {
  const document = await getDocument(query);
  if (!document) throw new summarifyError('No document with that id exists.', 404);

  const updatedDocument = await Document.findOneAndUpdate(query, documentDetails, { new: true });
  return updatedDocument;
};

const deleteDocument = async (id: ObjectId | string) => {
  const document = await getDocument({ _id: id });
  if (!document)
    throw new summarifyError(
      'No document with that id exists or document does not belong to your organization.',
      404
    );
  await Document.deleteOne({ _id: id });
};

const countDocuments = async (query: any) => {
  const documents = await Document.count(query);
  return documents;
};

const DocumentService = {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  countDocuments,
};
export default DocumentService;
