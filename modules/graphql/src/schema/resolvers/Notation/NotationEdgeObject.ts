import { NotationObject } from './NotationObject';
import { ObjectType, Field } from 'type-graphql';
import { Edge, ConnectionCursor } from '../Pagination';
import { Notation } from '@stringsync/domain';

@ObjectType()
export class NotationEdgeObject implements Edge<Notation> {
  @Field(() => NotationObject)
  node!: Notation;

  @Field({ description: 'Used in `before` and `after` args' })
  cursor!: ConnectionCursor;
}
