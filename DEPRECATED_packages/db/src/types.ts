import { Notation, Tag, Tagging, User } from '@stringsync/domain';

export { Sequelize } from 'sequelize';

export interface Db {
  cleanup(): Promise<void>;
  teardown(): Promise<void>;
}
