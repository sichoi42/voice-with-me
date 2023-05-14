import { Prisma, PrismaClient } from '@prisma/client';

console.log('Top of script');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const main = async () => {
  console.log('Start seeding...');

  console.log('Finished seeding.');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

console.log('Bottom of script');
