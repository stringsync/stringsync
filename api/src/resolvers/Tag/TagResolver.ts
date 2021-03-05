import { inject, injectable } from 'inversify';
import { Query, Resolver } from 'type-graphql';
import { Tag } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { TagService } from '../../services';
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
