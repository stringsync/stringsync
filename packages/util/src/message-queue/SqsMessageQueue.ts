import { inject, injectable } from '@stringsync/di';
import { SQS } from 'aws-sdk';
import { Logger } from '../logger';
import { UTIL_TYPES } from '../UTIL_TYPES';
import { Message, MessageQueue } from './types';

const TYPES = { ...UTIL_TYPES };

const DEFAULT_VISIBILITY_TIMEOUT_S = 60;

@injectable()
export class SqsMessageQueue implements MessageQueue {
  sqs: SQS;

  constructor(@inject(TYPES.Logger) public logger: Logger) {
    this.sqs = new SQS();
  }

  async get(queueUrl: string): Promise<Message | null> {
    this.logger.info(`getting messages from queue: ${queueUrl}`);
    const res = await this.sqs
      .receiveMessage({
        QueueUrl: queueUrl,
        VisibilityTimeout: DEFAULT_VISIBILITY_TIMEOUT_S,
        MaxNumberOfMessages: 1,
      })
      .promise();

    const messages = res.Messages;
    if (!messages) {
      this.logger.info(`got no messages from queue: ${queueUrl}`);
      return null;
    }

    const message = messages[0];
    if (!message) {
      this.logger.info(`got no messages from queue: ${queueUrl}`);
      return null;
    }
    this.logger.info(`got message: ${message.MessageId}`);

    return {
      id: message.MessageId!,
      body: message.Body!,
      recieptHandle: message.ReceiptHandle!,
      queueUrl,
    };
  }

  async ack(message: Message): Promise<void> {
    this.logger.info(`acking message: ${message.id}`);
    await this.sqs.deleteMessage({ QueueUrl: message.queueUrl, ReceiptHandle: message.recieptHandle }).promise();
    this.logger.info(`acked message: ${message.id}`);
  }
}
