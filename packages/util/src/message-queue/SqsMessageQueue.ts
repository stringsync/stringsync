import { NotFoundError } from '@stringsync/common';
import { SQS } from 'aws-sdk';
import { MessageList } from 'aws-sdk/clients/sqs';
import { MessageQueue, SqsConfig } from './types';

export class SqsMessageQueue implements MessageQueue {
  static create(config: SqsConfig): SqsMessageQueue {
    const sqs = new SQS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });
    return new SqsMessageQueue(sqs);
  }

  sqs: SQS;
  private queueUrlsByQueueName: { [key: string]: string } = {};

  constructor(sqs: SQS) {
    this.sqs = sqs;
  }

  async receive<T>(queueName: string): Promise<T[]> {
    const queueUrl = await this.getQueueUrl(queueName);

    const messages = await new Promise<MessageList>((resolve) => {
      this.sqs.receiveMessage({ QueueUrl: queueUrl, MaxNumberOfMessages: 1 }, (err, data) => {
        if (err) {
          throw err;
        }
        resolve(data.Messages);
      });
    });

    return messages
      .filter((message) => typeof message.Attributes !== 'undefined')
      .map((message) => {
        const attrs = message.Attributes as unknown;
        return attrs as T;
      });
  }

  private async getQueueUrl(queueName: string): Promise<string> {
    // check cache
    if (queueName in this.queueUrlsByQueueName) {
      return this.queueUrlsByQueueName[queueName];
    }

    const queueUrl = await new Promise<string | undefined>((resolve) => {
      this.sqs.getQueueUrl((err, data) => {
        if (err) {
          throw err;
        }
        resolve(data.QueueUrl);
      });
    });

    if (!queueUrl) {
      throw new NotFoundError(`queue url not found for: ${queueName}`);
    }

    // populate cache
    this.queueUrlsByQueueName[queueName] = queueUrl;

    return queueUrl;
  }
}
