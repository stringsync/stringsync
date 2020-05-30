export abstract class Repo<T> {
  public abstract connect(): Promise<void>;
  public abstract create(entity: T): Promise<void>;
  public abstract update(entity: T): Promise<void>;
}
