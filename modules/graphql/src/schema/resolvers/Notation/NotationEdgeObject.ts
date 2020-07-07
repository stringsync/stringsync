import { NotationObject } from './NotationObject';
import { ObjectType, Field } from 'type-graphql';
import { Edge } from '@stringsync/common';
import { Notation } from '@stringsync/domain';

@ObjectType()
export class NotationEdgeObject implements Edge<Notation> {
  @Field(() => NotationObject)
  node!: Notation;

  @Field({ description: 'Used in `before` and `after` args' })
  cursor!: string;
}
