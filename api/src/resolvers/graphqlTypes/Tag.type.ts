import { Ctx, Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import * as domain from '../../domain';
import { TYPES } from '../../inversify.constants';
import { NotationService } from '../../services';
import { ResolverCtx } from '../types';
import { Notation } from './Notation.type';

registerEnumType(domain.TagCategory, {
  name: 'TagCategory',
});

@ObjectType()
export class Tag implements domain.Tag {
  @Field((type) => ID)
  id!: string;

  @Field((type) => domain.TagCategory)
  category!: domain.TagCategory;

  @Field()
  name!: string;

  @Field((type) => [Notation], { nullable: true })
  async notations(@Ctx() ctx: ResolverCtx): Promise<domain.Notation[]> {
    const notationService = ctx.getContainer().get<NotationService>(TYPES.NotationService);
    return await notationService.findAllByTagId(this.id);
  }
}
