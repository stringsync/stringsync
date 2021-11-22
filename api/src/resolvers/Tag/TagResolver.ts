import { inject, injectable } from 'inversify';
import { pick } from 'lodash';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Tag } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { TagService } from '../../services';
import { CreateTagInput } from './CreateTagInput';
import { TagObject } from './TagObject';
import { UpdateTagInput } from './UpdateTagInput';

@Resolver()
@injectable()
export class TagResolver {
  tagService: TagService;

  constructor(@inject(TYPES.TagService) tagService: TagService) {
    this.tagService = tagService;
  }

  @Query((returns) => [TagObject])
  async tags(): Promise<Tag[]> {
    return await this.tagService.findAll();
  }

  @Mutation((returns) => TagObject)
  async updateTag(@Arg('input') input: UpdateTagInput): Promise<Tag> {
    const attrs = pick(input, ['name', 'category']);
    return await this.tagService.update(input.id, attrs);
  }

  @Mutation((returns) => TagObject)
  async createTag(@Arg('input') input: CreateTagInput): Promise<Tag> {
    return await this.tagService.create({
      name: input.name,
      category: input.category,
    });
  }

  @Mutation((returns) => Boolean)
  async deleteTag(@Arg('id') id: string): Promise<boolean> {
    await this.tagService.delete(id);
    return true;
  }
}
