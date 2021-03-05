import { injectable } from 'inversify';
import { ArgsType, Field } from 'type-graphql';
import { ConnectionArgs as IConnectionArgs } from '../../util';

@ArgsType()
@injectable()
export class ConnectionArgs implements IConnectionArgs {
  @Field({ nullable: true, description: 'paginate before opaque cursor' })
  before!: string;

  @Field({ nullable: true, description: 'paginate after opaque cursor' })
  after!: string;

  @Field({ nullable: true, description: 'paginate first' })
  first!: number;

  @Field({ nullable: true, description: 'paginate last' })
  last!: number;
}
