import { User, Notation } from '../../common';
import DataLoader from 'dataloader';

export interface DataLoaders {
  usersById: DataLoader<string, User | null>;
  notationsByUserId: DataLoader<string, Notation[]>;
}
