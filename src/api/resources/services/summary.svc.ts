import { ObjectId } from 'mongodb';

import Summary from '../../../db/models/Summary.model';
import summarifyError from '../../lib/error';
import { generateMeta } from '../../lib/pagination';
import { ISummary, OSummary } from '../interfaces/summary.intf';

const getSummaries = async ({
  limit = 10,
  page = 1,
  query = {},
  sort = { name: 'acs' },
  userId,
}: {
  query: any;
  page?: number;
  limit?: number;
  sort?: Record<any, any>;
  userId: ObjectId | string;
}) => {
  const revampedSearchQuery = {
    createdBy: userId,
    ...query,
  };

  const count = await Summary.count(revampedSearchQuery);
  const summaries = await Summary.find(revampedSearchQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort);

  return { summaries, meta: generateMeta(page, count, limit) };
};

const getSummary = async (query: any) => {
  const summary = await Summary.findOne(query);
  return summary;
};

const createSummary = async (summaryDetails: ISummary) => {
  const summary = await Summary.create(summaryDetails);
  summary.save();
  return summary;
};

const updateSummary = async ({
  query,
  summaryDetails,
}: {
  query: any;
  summaryDetails: Partial<OSummary>;
}) => {
  const summary = await getSummary(query);
  if (!summary) throw new summarifyError('No summary with that id exists.', 404);

  const updatedSummary = await Summary.findOneAndUpdate(query, summaryDetails, { new: true });
  return updatedSummary;
};

const deleteSummary = async (id: ObjectId | string) => {
  const summary = await getSummary({ _id: id });
  if (!summary)
    throw new summarifyError(
      'No summary with that id exists or summary does not belong to your organization.',
      404
    );
  await Summary.deleteOne({ _id: id });
};

const countSummaries = async (query: any) => {
  const summaries = await Summary.count(query);
  return summaries;
};

const SummaryService = {
  getSummaries,
  getSummary,
  createSummary,
  updateSummary,
  deleteSummary,
  countSummaries,
};
export default SummaryService;
