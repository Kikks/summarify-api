import { Meta } from '../../types/Meta.type';

export const calculatePages = (totalDocs: number, limit: number) =>
  totalDocs % limit === 0 ? Math.floor(totalDocs / limit) : Math.floor(totalDocs / limit) + 1;

export const generateMeta: (page: number, count: number, limit: number) => Meta = (
  page,
  count,
  limit
) => ({
  currentPage: page,
  pages: calculatePages(count, limit),
  total: count,
});
