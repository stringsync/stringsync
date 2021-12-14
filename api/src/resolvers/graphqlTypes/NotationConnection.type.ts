import { Field, ObjectType } from 'type-graphql';
import * as domain from '../../domain';
import { Connection, Edge } from '../../util';
import { NotationEdge } from './NotationEdge.type';
import { PageInfo } from './PageInfo.type';

@ObjectType()
export class NotationConnection implements Connection<domain.Notation> {
  static of(attrs: Connection<domain.Notation>) {
    const connection = new NotationConnection();
    connection.pageInfo = PageInfo.of(attrs.pageInfo);
    connection.edges = attrs.edges;
    return connection;
  }

  @Field((type) => PageInfo)
  pageInfo!: PageInfo;

  @Field((type) => [NotationEdge])
  edges!: Edge<domain.Notation>[];
}
