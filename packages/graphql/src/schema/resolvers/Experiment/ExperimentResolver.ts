import { AuthRequirement } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { MessageQueue } from '@stringsync/util';
import { inject, injectable } from 'inversify';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { WithAuthRequirement } from '../../middlewares';

@Resolver()
@injectable()
export class ExperimentResolver {
  messageQueue: MessageQueue;

  constructor(@inject(TYPES.MessageQueue) messageQueue: MessageQueue) {
    this.messageQueue = messageQueue;
  }

  @Query((returns) => String, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))
  async sqs(): Promise<string> {
    return JSON.stringify(await this.messageQueue.receive('ss-vids-dev'));
  }
}
