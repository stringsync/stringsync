export type SqsConfig = {
  region: string;
};

export type Message = {
  id: string;
  body: string;
  recieptHandle: string;
  queueUrl: string;
};

export interface MessageQueue {
  get(queueUrl: string): Promise<Message | null>;
  ack(message: Message): Promise<void>;
}
