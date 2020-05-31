export interface Repo<T> {
  get(id: any): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<void>;
}
