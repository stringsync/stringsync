import { Field, ObjectType } from 'type-graphql';
import { PageInfo as IPageInfo } from '../../util';

@ObjectType()
export class PageInfo implements IPageInfo {
  static of(attrs: IPageInfo) {
    const pageInfo = new PageInfo();
    pageInfo.hasNextPage = attrs.hasNextPage;
    pageInfo.hasPreviousPage = attrs.hasPreviousPage;
    pageInfo.startCursor = attrs.startCursor;
    pageInfo.endCursor = attrs.endCursor;
    return pageInfo;
  }

  @Field(() => Boolean, { nullable: true })
  hasNextPage!: boolean | null;

  @Field(() => Boolean, { nullable: true })
  hasPreviousPage!: boolean | null;

  @Field(() => String, { nullable: true })
  startCursor!: string | null;

  @Field(() => String, { nullable: true })
  endCursor!: string | null;
}
