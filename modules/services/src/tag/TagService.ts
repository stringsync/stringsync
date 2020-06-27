import { TYPES } from '@stringsync/container';
import { injectable, inject } from 'inversify';
import { TagRepo } from '@stringsync/repos';

@injectable()
export class TagService {
  readonly tagRepo: TagRepo;

  constructor(@inject(TYPES.TagRepo) tagRepo: TagRepo) {
    this.tagRepo = tagRepo;
  }
}
