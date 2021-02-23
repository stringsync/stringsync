import { Field, ObjectType } from 'type-graphql';
import { PageInfo } from '../../util';

@ObjectType()
export class PageInfoObject implements PageInfo {
  @Field()
  hasNextPage!: boolean;

  @Field()
  hasPreviousPage!: boolean;

  @Field(() => String, { nullable: true })
  startCursor!: string | null;

  @Field(() => String, { nullable: true })
  endCursor!: string | null;
}
