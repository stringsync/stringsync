import { NotationEdgeObject } from './NotationEdgeObject';
import { PageInfoObject, Connection, Edge } from '../Pagination';
import { ObjectType, Field } from 'type-graphql';
import { Notation } from '@stringsync/domain';

@ObjectType()
export class NotationConnectionObject implements Connection<Notation> {
  @Field()
  pageInfo!: PageInfoObject;

  @Field(() => [NotationEdgeObject])
  edges!: Edge<Notation>[];
}
