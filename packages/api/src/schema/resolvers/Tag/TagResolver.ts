import { inject, injectable, TYPES } from '@stringsync/di';
import { Tag } from '@stringsync/domain';
import { TagService } from '@stringsync/services';
import { Query, Resolver } from 'type-graphql';
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
}
