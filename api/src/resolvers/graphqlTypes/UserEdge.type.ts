import { Field, ObjectType } from 'type-graphql';
import { Edge } from '../../util';
import { User } from './User.type';

@ObjectType()
export class UserEdge implements Edge<User> {
  @Field(() => User)
  node!: User;

  @Field()
  cursor!: string;
}
