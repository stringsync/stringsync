import { inject, injectable } from '@stringsync/di';
import { Tag } from '@stringsync/domain';
import { SERVICES_TYPES, TagService } from '@stringsync/services';
import { Query, Resolver } from 'type-graphql';
import { TagObject } from './TagObject';

@Resolver()
@injectable()
export class TagResolver {
  tagService: TagService;

  constructor(@inject(SERVICES_TYPES.TagService) tagService: TagService) {
    this.tagService = tagService;
  }

  @Query((returns) => [TagObject])
  async tags(): Promise<Tag[]> {
    return await this.tagService.findAll();
  }
}
