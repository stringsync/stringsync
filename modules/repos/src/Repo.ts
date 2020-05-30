export abstract class Repo<T> {
  public abstract get(id: any): Promise<T | null>;
  public abstract create(entity: T): Promise<T>;
  public abstract update(entity: T): Promise<void>;
}
