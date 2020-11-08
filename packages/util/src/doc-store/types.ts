export interface DocStore {
  has<T>(key: string): Promise<boolean>;
  get<T>(key: string): Promise<T>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
}
