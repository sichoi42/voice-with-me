import { Category, NewsSummary } from '@/types';

export const getNewsSummary = async (category: Category) => {
  return {
    title: 'title',
    content: 'content',
    url: 'url',
    publisher: 'publisher',
    publishedAt: new Date(),
    writer: 'writer',
    category: category,
  } as NewsSummary;
};
