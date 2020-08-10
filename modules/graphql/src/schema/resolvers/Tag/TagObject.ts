import { TYPES } from '@stringsync/container';
import { NotationService } from '@stringsync/services';
import { ReqCtx } from '../../../ctx';
import { NotationObject } from '../Notation';
import { Tag, Notation } from '@stringsync/domain';
import { ObjectType, Field, ID, Root, Ctx } from 'type-graphql';

@ObjectType()
export class TagObject implements Tag {
  @Field((type) => ID)
  id!: string;

  @Field()
  name!: string;

  @Field((type) => [NotationObject], { nullable: true })
  async notations(@Root() tag: Tag, @Ctx() ctx: ReqCtx): Promise<Notation[]> {
    const notationService = ctx.container.get<NotationService>(TYPES.NotationService);
    return await notationService.findAllByTagId(tag.id);
  }
}
