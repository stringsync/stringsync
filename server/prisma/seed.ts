import { prisma } from './generated/prisma-client';

const seed = async () => {
  await prisma.createUser({
    name: 'Alice',
    email: 'alice@prisma.io',
  });
};

seed();
