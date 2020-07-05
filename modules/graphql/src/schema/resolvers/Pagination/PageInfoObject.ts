import { ObjectType, Field } from 'type-graphql';
import { ConnectionCursor, PageInfo } from './types';

@ObjectType()
export class PageInfoObject implements PageInfo {
  @Field()
  hasNextPage!: boolean;
  @Field()
  hasPreviousPage!: boolean;
  @Field()
  startCursor?: ConnectionCursor;
  @Field()
  endCursor?: ConnectionCursor;
}
