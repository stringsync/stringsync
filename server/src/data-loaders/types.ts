import { User, Notation } from 'common/types';
import DataLoader = require('dataloader');

export interface DataLoaders {
  usersById: DataLoader<string, User | null>;
  notationsByUserId: DataLoader<string, Notation[]>;
}
