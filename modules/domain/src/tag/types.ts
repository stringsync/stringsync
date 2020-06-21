import { Notation } from '@stringsync/domain';

export interface Tag {
  id: number;
  name: string;
  notations: Notation[];
}
