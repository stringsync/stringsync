import { NotFoundError } from '@stringsync/common';
import { DynamoDB } from 'aws-sdk';
import { DocStore, DynamoDbConfig } from './types';

export class DynamoDbDocStore implements DocStore {
  static create(config: DynamoDbConfig): DynamoDbDocStore {
    const dynamoDb = new DynamoDB(config);
    return new DynamoDbDocStore(dynamoDb, config.table);
  }

  dynamoDb: DynamoDB;
  table: string;

  constructor(dynamoDb: DynamoDB, table: string) {
    this.dynamoDb = dynamoDb;
    this.table = table;
  }

  async get<T>(key: string): Promise<T> {
    return await new Promise((resolve) =>
      this.dynamoDb.getItem(
        {
          TableName: this.table,
          Key: DynamoDB.Converter.marshall({
            guid: key,
          }),
        },
        (err, data) => {
          if (err) {
            throw err;
          }
          if (!data.Item) {
            throw new NotFoundError(`missing key: ${key}`);
          }
          resolve(DynamoDB.Converter.unmarshall(data.Item) as T);
        }
      )
    );
  }
}
