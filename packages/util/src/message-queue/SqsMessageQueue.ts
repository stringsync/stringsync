import { SQS } from 'aws-sdk';
import { Logger } from '../logger';
import { Message, MessageQueue } from './types';

const DEFAULT_VISIBILITY_TIMEOUT_S = 60;

export class SqsMessageQueue implements MessageQueue {
  static create(logger: Logger): SqsMessageQueue {
    const sqs = new SQS();
    return new SqsMessageQueue(logger, sqs);
  }

  logger: Logger;
  sqs: SQS;

  constructor(logger: Logger, sqs: SQS) {
    this.logger = logger;
    this.sqs = sqs;
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
