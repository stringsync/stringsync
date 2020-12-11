import { AuthRequirement } from '@stringsync/common';
import { inject, injectable } from '@stringsync/di';
import { Logger, MessageQueue, UTIL_TYPES } from '@stringsync/util';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { WithAuthRequirement } from '../../middlewares';

const TYPES = { ...UTIL_TYPES };

@Resolver()
@injectable()
export class ExperimentResolver {
  constructor(
    @inject(TYPES.Logger) public logger: Logger,
    @inject(TYPES.MessageQueue) public messageQueue: MessageQueue
  ) {}

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
