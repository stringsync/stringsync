export interface DocStore {
  get<T>(key: string): Promise<T>;
}

export type DynamoDbConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  table: string;
};
