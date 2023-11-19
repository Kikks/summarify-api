import axios from 'axios';

import { DA_SERVER } from '../api/lib/constants';

const baseAxiosMethod = axios.create({
  baseURL: DA_SERVER,
});

const summarizeText = async (text: string) => {
  const { data } = await baseAxiosMethod.post('/summarize', { text });
  return data?.data?.summary;
};

const queryDocument = async (query: string, text: string) => {
  const { data } = await baseAxiosMethod.post('/query-text', { query, text });
  return data?.data?.reply;
};

const addSummarizeJobToQueue = async ({
  documentId,
  text,
  userId,
}: {
  documentId: string;
  text: string;
  userId: string;
}) => {
  const { data } = await baseAxiosMethod.post('/summarize-job', { documentId, text, userId });
  return !!data?.data?.queued;
};

export { summarizeText, queryDocument, addSummarizeJobToQueue };
