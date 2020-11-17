import { NotFoundError } from '@stringsync/common';
import { SQS } from 'aws-sdk';
import { stringType } from 'aws-sdk/clients/iam';
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

  private queueUrlsByQueueName: { [key: string]: string } = {};

  constructor(logger: Logger, sqs: SQS) {
    this.logger = logger;
    this.sqs = sqs;
  }

  async get(queueName: stringType): Promise<Message | null> {
    const queueUrl = await this.getQueueUrl(queueName);

    this.logger.info(`getting messages from queue: ${queueName}`);
    const res = await this.sqs
      .receiveMessage({
        QueueUrl: queueUrl,
        VisibilityTimeout: DEFAULT_VISIBILITY_TIMEOUT_S,
        MaxNumberOfMessages: 1,
      })
      .promise();

    const messages = res.Messages;
    if (!messages) {
      this.logger.info(`got no messages from queue: ${queueName}`);
      return null;
    }

    const message = messages[0];
    if (!message) {
      this.logger.info(`got no messages from queue: ${queueName}`);
      return null;
    }

    this.logger.info(`got message: ${message.MessageId}`);
    return {
      id: message.MessageId!,
      body: message.Body!,
      recieptHandle: message.ReceiptHandle!,
      queueName,
    };
  }

  async ack(message: Message): Promise<void> {
    const queueUrl = await this.getQueueUrl(message.queueName);
    this.logger.info(`acking message: ${message.id}`);
    await this.sqs.deleteMessage({ QueueUrl: queueUrl, ReceiptHandle: message.recieptHandle }).promise();
  }

  private async getQueueUrl(queueName: string): Promise<string> {
    // check cache
    if (queueName in this.queueUrlsByQueueName) {
      return this.queueUrlsByQueueName[queueName];
    }

    const res = await this.sqs.getQueueUrl({ QueueName: queueName }).promise();

    const queueUrl = res.QueueUrl;
    if (!queueUrl) {
      throw new NotFoundError(`queue url not found for: ${queueName}`);
    }

    // populate cache
    this.queueUrlsByQueueName[queueName] = queueUrl;

    return queueUrl;
  }
}
