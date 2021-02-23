import { Field, ObjectType } from 'type-graphql';
import { Notation } from '../../domain';
import { Connection, Edge } from '../../util';
import { PageInfoObject } from './../Paging';
import { UserEdgeObject } from './UserEdgeObject';

@ObjectType()
export class UserConnectionObject implements Connection<Notation> {
  @Field()
  pageInfo!: PageInfoObject;

  @Field(() => [UserEdgeObject])
  edges!: Edge<Notation>[];
}
