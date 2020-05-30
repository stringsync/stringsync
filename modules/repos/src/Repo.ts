export abstract class Repo<T> {
  public abstract create(entity: T): Promise<T>;
  public abstract update(entity: T): Promise<void>;
}
