import { NotationEdgeObject } from './NotationEdgeObject';
import { PageInfoObject } from '../Pagination';
import { Connection, Edge } from 'graphql-relay';
import { ObjectType, Field } from 'type-graphql';
import { Notation } from '@stringsync/domain';

@ObjectType()
export class NotationConnectionObject implements Connection<Notation> {
  @Field()
  pageInfo!: PageInfoObject;

  @Field(() => [NotationEdgeObject])
  edges!: Edge<Notation>[];
}
