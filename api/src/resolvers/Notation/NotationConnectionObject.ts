import { Field, ObjectType } from 'type-graphql';
import { Notation } from '../../domain';
import { Connection, Edge } from '../../util';
import { PageInfoObject } from './../Paging';
import { NotationEdgeObject } from './NotationEdgeObject';

@ObjectType()
export class NotationConnectionObject implements Connection<Notation> {
  @Field()
  pageInfo!: PageInfoObject;

  @Field(() => [NotationEdgeObject])
  edges!: Edge<Notation>[];
}
