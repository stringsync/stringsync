import { ArgsType, Field } from 'type-graphql';
import { ConnectionArgs as ConnectionArgsInterface } from '@stringsync/common';
import { injectable } from 'inversify';

@ArgsType()
@injectable()
export class ConnectionArgs implements ConnectionArgsInterface {
  @Field({ nullable: true, description: 'Paginate before opaque cursor' })
  before?: string;

  @Field({ nullable: true, description: 'Paginate after opaque cursor' })
  after?: string;

  @Field({ nullable: true, description: 'Paginate first' })
  first?: number;

  @Field({ nullable: true, description: 'Paginate last' })
  last?: number;
}
