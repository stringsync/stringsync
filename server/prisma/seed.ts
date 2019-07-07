import { prisma } from './generated/prisma-client';

const names = [
  'Aaren',
  'Aarika',
  'Abagael',
  'Abagail',
  'Abbe',
  'Abbey',
  'Alice',
];

const seed = async () => {
  for (const name of names) {
    await prisma.createUser({
      name,
      email: `${name}@stringsync.com`,
    });
  }
};

seed();
