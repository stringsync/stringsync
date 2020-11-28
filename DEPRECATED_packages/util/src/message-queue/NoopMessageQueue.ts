import { Message, MessageQueue } from './types';

export class NoopMessageQueue implements MessageQueue {
  async get(queueName: string) {
    return null;
  }

  async ack(message: Message) {
    return;
  }
}
