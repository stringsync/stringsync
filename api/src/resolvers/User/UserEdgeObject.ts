import { Field, ObjectType } from 'type-graphql';
import { Notation } from '../../domain';
import { Edge } from '../../util';
import { UserObject } from './UserObject';

@ObjectType()
export class UserEdgeObject implements Edge<Notation> {
  @Field(() => UserObject)
  node!: Notation;

  @Field()
  cursor!: string;
}
