export interface DocStore {
  get<T>(key: string): Promise<T>;
}

export type DynamoDbConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  table: string;
};
