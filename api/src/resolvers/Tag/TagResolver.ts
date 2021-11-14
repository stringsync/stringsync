import { inject, injectable } from 'inversify';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Tag } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { TagService } from '../../services';
import { CreateTagInput } from './CreateTagInput';
import { TagObject } from './TagObject';

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
  async createTag(@Arg('input') input: CreateTagInput): Promise<Tag> {
    return await this.tagService.create({
      name: input.name,
      category: input.category,
    });
  }
}
