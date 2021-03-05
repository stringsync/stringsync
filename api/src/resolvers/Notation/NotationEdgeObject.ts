import { Field, ObjectType } from 'type-graphql';
import { Notation } from '../../domain';
import { Edge } from '../../util';
import { NotationObject } from './NotationObject';

@ObjectType()
export class NotationEdgeObject implements Edge<Notation> {
  @Field(() => NotationObject)
  node!: Notation;

  @Field({ description: 'Used in `before` and `after` args' })
  cursor!: string;
}
