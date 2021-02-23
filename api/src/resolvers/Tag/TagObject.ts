import { Ctx, Field, ID, ObjectType, Root } from 'type-graphql';
import { Notation, Tag } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { NotationService } from '../../services';
import { NotationObject } from '../Notation';
import { ResolverCtx } from '../types';

@ObjectType()
export class TagObject implements Tag {
  @Field((type) => ID)
  id!: string;

  @Field()
  name!: string;

  @Field((type) => [NotationObject], { nullable: true })
  async notations(@Root() tag: Tag, @Ctx() ctx: ResolverCtx): Promise<Notation[]> {
    const notationService = ctx.getContainer().get<NotationService>(TYPES.NotationService);
    return await notationService.findAllByTagId(tag.id);
  }
}
