import { Field, ObjectType } from 'type-graphql';
import * as domain from '../../domain';
import { Edge } from '../../util';
import { Notation } from './Notation.type';

@ObjectType()
export class NotationEdge implements Edge<domain.Notation> {
  @Field(() => Notation)
  node!: domain.Notation;

  @Field({ description: 'Used in `before` and `after` args' })
  cursor!: string;
}
