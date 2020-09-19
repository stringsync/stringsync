export type RedisConfig = {
  host: string;
  port: number;
};

export interface Cache {
  cleanup(): Promise<void>;
  teardown(): Promise<void>;
  checkHealth(): Promise<boolean>;
  get(key: string): Promise<string>;
  set(key: string, value: string): Promise<void>;
}
