import { Ctx, Field, ID, ObjectType, registerEnumType, Root } from 'type-graphql';
import { Notation, Tag, TagCategory } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { NotationService } from '../../services';
import { NotationObject } from '../Notation';
import { ResolverCtx } from '../types';

registerEnumType(TagCategory, {
  name: 'TagCategory',
});

@ObjectType()
export class TagObject implements Tag {
  @Field((type) => ID)
  id!: string;

  @Field((type) => TagCategory)
  category!: TagCategory;

  @Field()
  name!: string;

  @Field((type) => [NotationObject], { nullable: true })
  async notations(@Root() tag: Tag, @Ctx() ctx: ResolverCtx): Promise<Notation[]> {
    const notationService = ctx.getContainer().get<NotationService>(TYPES.NotationService);
    return await notationService.findAllByTagId(tag.id);
  }
}
