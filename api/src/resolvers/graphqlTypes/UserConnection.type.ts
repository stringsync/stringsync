import { Field, ObjectType } from 'type-graphql';
import * as domain from '../../domain';
import { Connection, Edge } from '../../util';
import { PageInfo } from './PageInfo.type';
import { UserEdge } from './UserEdge.type';

@ObjectType()
export class UserConnection implements Connection<domain.User> {
  static of(attrs: Connection<domain.User>) {
    const connection = new UserConnection();
    connection.pageInfo = PageInfo.of(attrs.pageInfo);
    connection.edges = attrs.edges;
    return connection;
  }

  @Field((type) => PageInfo)
  pageInfo!: PageInfo;

  @Field((type) => [UserEdge])
  edges!: Edge<domain.User>[];
}
