import { UserObject } from './UserObject';
import { ObjectType, Field } from 'type-graphql';
import { Edge } from '@stringsync/common';
import { Notation } from '@stringsync/domain';

@ObjectType()
export class UserEdgeObject implements Edge<Notation> {
  @Field(() => UserObject)
  node!: Notation;

  @Field()
  cursor!: string;
}
