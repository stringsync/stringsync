import { Connection, Edge } from '@stringsync/common';
import { Notation } from '@stringsync/domain';
import { Field, ObjectType } from 'type-graphql';
import { PageInfoObject } from './../Paging';
import { UserEdgeObject } from './UserEdgeObject';

@ObjectType()
export class UserConnectionObject implements Connection<Notation> {
  @Field()
  pageInfo!: PageInfoObject;

  @Field(() => [UserEdgeObject])
  edges!: Edge<Notation>[];
}
