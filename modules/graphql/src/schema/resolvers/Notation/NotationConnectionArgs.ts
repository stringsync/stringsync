import { NotationConnectionArgs as INotationConnectionArgs } from '@stringsync/common';
import { ArgsType, Field } from 'type-graphql';
import { injectable } from 'inversify';

@ArgsType()
@injectable()
export class NotationConnectionArgs implements INotationConnectionArgs {
  @Field({ nullable: true, description: 'paginate before opaque cursor' })
  before!: string;

  @Field({ nullable: true, description: 'paginate after opaque cursor' })
  after!: string;

  @Field({ nullable: true, description: 'paginate first' })
  first!: number;

  @Field({ nullable: true, description: 'paginate last' })
  last!: number;

  @Field({ nullable: true, description: 'song, artist, or transcriber name' })
  query!: string;

  @Field(() => [String], { nullable: true, description: 'tag ids' })
  tagIds!: string[];
}
