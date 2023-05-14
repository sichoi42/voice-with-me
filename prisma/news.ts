// import { Category } from '@/types';
// import { prisma } from './prisma';

// export const getNewRamdomNews = async (category: Category) => {
//   const news = await prisma.news.findMany({
//     where: {
//       category,
//     },
//   });
//   // random으로 1개
//   const randomIndex = Math.floor(Math.random() * news.length);
//   return news[randomIndex];
// };
