import { Connection, Edge } from '@stringsync/common';
import { Notation } from '@stringsync/domain';
import { Field, ObjectType } from 'type-graphql';
import { PageInfoObject } from './../Paging';
import { NotationEdgeObject } from './NotationEdgeObject';

@ObjectType()
export class NotationConnectionObject implements Connection<Notation> {
  @Field()
  pageInfo!: PageInfoObject;

  @Field(() => [NotationEdgeObject])
  edges!: Edge<Notation>[];
}
