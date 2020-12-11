import { Notation, Tag } from '@stringsync/domain';
import { NotationService, SERVICES_TYPES } from '@stringsync/services';
import { Ctx, Field, ID, ObjectType, Root } from 'type-graphql';
import { ReqCtx } from '../../../ctx';
import { NotationObject } from '../Notation';

@ObjectType()
export class TagObject implements Tag {
  @Field((type) => ID)
  id!: string;

  @Field()
  name!: string;

  @Field((type) => [NotationObject], { nullable: true })
  async notations(@Root() tag: Tag, @Ctx() ctx: ReqCtx): Promise<Notation[]> {
    const notationService = ctx.container.get<NotationService>(SERVICES_TYPES.NotationService);
    return await notationService.findAllByTagId(tag.id);
  }
}
