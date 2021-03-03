import { Field, ObjectType } from 'type-graphql';
import { User } from '../../domain';
import { Edge } from '../../util';
import { UserObject } from './UserObject';

@ObjectType()
export class UserEdgeObject implements Edge<User> {
  @Field(() => UserObject)
  node!: User;

  @Field()
  cursor!: string;
}
