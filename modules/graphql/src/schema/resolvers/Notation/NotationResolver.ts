import { NotationConnectionObject } from './NotationConnectionObject';
import { Connection } from '@stringsync/common';
import { TYPES } from '@stringsync/container';
import { Notation } from '@stringsync/domain';
import { NotationService } from '@stringsync/services';
import { inject, injectable } from 'inversify';
import { Args, Query, Resolver } from 'type-graphql';
import { ConnectionArgs } from './../Paging';

@Resolver()
@injectable()
export class NotationResolver {
  notationService: NotationService;

  constructor(@inject(TYPES.NotationService) notationService: NotationService) {
    this.notationService = notationService;
  }

  @Query((returns) => NotationConnectionObject)
  async notations(@Args() args: ConnectionArgs): Promise<Connection<Notation>> {
    return await this.notationService.findPage(args);
  }
}
