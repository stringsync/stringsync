import { TYPES } from '@stringsync/container';
import { Tag } from '@stringsync/domain';
import { TagObject } from './TagObject';
import { TagService } from '@stringsync/services';
import { Resolver, Query } from 'type-graphql';
import { injectable, inject } from 'inversify';

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
