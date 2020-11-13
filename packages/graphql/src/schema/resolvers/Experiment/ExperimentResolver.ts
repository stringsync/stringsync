import { AuthRequirement } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { Logger, MessageQueue } from '@stringsync/util';
import { inject, injectable } from 'inversify';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { WithAuthRequirement } from '../../middlewares';

@Resolver()
@injectable()
export class ExperimentResolver {
  logger: Logger;
  messageQueue: MessageQueue;

  constructor(@inject(TYPES.Logger) logger: Logger, @inject(TYPES.MessageQueue) messageQueue: MessageQueue) {
    this.logger = logger;
    this.messageQueue = messageQueue;
  }

  @Query((returns) => String, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))
  async sqs(): Promise<string> {
    const message = await this.messageQueue.get('ss-vids-dev');
    if (!message) {
      return 'no message';
    }
    await this.messageQueue.ack(message);
    return message.body;
  }
}
