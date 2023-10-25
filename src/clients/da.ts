import axios from 'axios';
import { DA_SERVER } from 'src/api/lib/constants';

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

export { summarizeText, queryDocument };
