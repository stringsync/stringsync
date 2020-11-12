export type SqsConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};

export type Message = {
  id: string;
  body: string;
  recieptHandle: string;
  queueName: string;
};

export interface MessageQueue {
  get(queueName: string): Promise<Message | null>;
  ack(message: Message): Promise<void>;
}
