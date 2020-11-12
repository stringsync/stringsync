export type SqsConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};

export interface MessageQueue {
  receive<T>(queueName: string): Promise<T[]>;
}
