import { inject, injectable } from 'inversify';
import { pick } from 'lodash';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { ltAdmin } from '../../domain';
import * as errors from '../../errors';
import { TYPES } from '../../inversify.constants';
import { TagService } from '../../services';
import * as types from '../graphqlTypes';
import { ResolverCtx } from '../types';

@Resolver()
@injectable()
export class TagResolver {
  tagService: TagService;

  constructor(@inject(TYPES.TagService) tagService: TagService) {
    this.tagService = tagService;
  }

  @Query((returns) => [types.Tag])
  async tags(): Promise<types.Tag[]> {
    const tags = await this.tagService.findAll();
    return tags.map(types.Tag.of);
  }

  @Mutation((returns) => types.UpdateTagOutput)
  async updateTag(
    @Arg('input') input: types.UpdateTagInput,
    @Ctx() ctx: ResolverCtx
  ): Promise<typeof types.UpdateTagOutput> {
    const sessionUser = ctx.getSessionUser();
    if (!sessionUser.isLoggedIn || ltAdmin(sessionUser.role)) {
      return types.ForbiddenError.of({ message: 'must be logged in as admin' });
    }

    const attrs = pick(input, ['name', 'category']);
    try {
      const tag = await this.tagService.update(input.id, attrs);
      return types.Tag.of(tag);
    } catch (e) {
      if (e instanceof errors.BadRequestError) {
        return types.BadRequestError.of(e);
      } else if (e instanceof errors.ValidationError) {
        return types.ValidationError.of(e);
      } else if (e instanceof errors.NotFoundError) {
        return types.NotFoundError.of(e);
      } else {
        return types.UnknownError.of(e);
      }
    }
  }

  @Mutation((returns) => types.CreateTagOutput)
  async createTag(
    @Arg('input') input: types.CreateTagInput,
    @Ctx() ctx: ResolverCtx
  ): Promise<typeof types.CreateTagOutput> {
    const sessionUser = ctx.getSessionUser();
    if (!sessionUser.isLoggedIn || ltAdmin(sessionUser.role)) {
      return types.ForbiddenError.of({ message: 'must be logged in as admin' });
    }

    try {
      const tag = await this.tagService.create({
        name: input.name,
        category: input.category,
      });
      return types.Tag.of(tag);
    } catch (e) {
      if (e instanceof errors.BadRequestError) {
        return types.BadRequestError.of(e);
      } else {
        return types.UnknownError.of(e);
      }
    }
  }

  @Mutation((returns) => types.DeleteTagOutput)
  async deleteTag(@Arg('id') id: string, @Ctx() ctx: ResolverCtx): Promise<typeof types.DeleteTagOutput> {
    const sessionUser = ctx.getSessionUser();
    if (!sessionUser.isLoggedIn || ltAdmin(sessionUser.role)) {
      return types.ForbiddenError.of({ message: 'must be logged in as admin' });
    }

    try {
      await this.tagService.delete(id);
      return types.Processed.now();
    } catch (e) {
      return types.UnknownError.of(e);
    }
  }
}
