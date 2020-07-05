import { ArgsType, Field } from 'type-graphql';
import { ConnectionArguments, ConnectionCursor } from 'graphql-relay';

@ArgsType()
export class ConnectionArgs implements ConnectionArguments {
  @Field({ nullable: true, description: 'Paginate before opaque cursor' })
  before?: ConnectionCursor;
  @Field({ nullable: true, description: 'Paginate after opaque cursor' })
  after?: ConnectionCursor;
  @Field({ nullable: true, description: 'Paginate first' })
  first?: number;
  @Field({ nullable: true, description: 'Paginate last' })
  last?: number;
}
