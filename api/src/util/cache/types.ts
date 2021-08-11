export interface Cache {
  get(key: string): Promise<string>;
  set(key: string, value: string, expiration?: number): Promise<void>;
  cleanup(): Promise<void>;
  teardown(): Promise<void>;
  checkHealth(): Promise<boolean>;
}
