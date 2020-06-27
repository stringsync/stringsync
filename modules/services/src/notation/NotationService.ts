import { TYPES } from '@stringsync/container';
import { injectable, inject } from 'inversify';
import { NotationRepo } from '@stringsync/repos';

@injectable()
export class NotationService {
  readonly notationRepo: NotationRepo;

  constructor(@inject(TYPES.NotationRepo) notationRepo: NotationRepo) {
    this.notationRepo = notationRepo;
  }
}
