import { Prisma } from '@/prisma/generated/prisma-client';

export interface Context {
  prisma: Prisma;
}
