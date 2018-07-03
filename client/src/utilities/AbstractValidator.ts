export abstract class AbstractValidator<T> {
  public readonly target: T;

  constructor(target: T, ...args: any[]) {
    this.target = target;
  }

  /**
   * Use the constructor to set instance variables needed throughout sub validations.
   */
  public abstract validate(): void;
  
  /**
   * Throws an error
   * 
   * @param msg
   */
  protected error(msg: string): void {
    throw new Error(msg);
  }
}
