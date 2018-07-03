/**
 * This abstract class sets up the validator framework, which allows the extendee to
 * collect multiple errors in an array, and throw them all at once.
 * 
 * Extenders of this class should only call validate once.
 */
export abstract class AbstractValidator<T> {
  public readonly target: T;
  public readonly errors: Error[] = [];
  private validated: boolean = false; // describes if validate has been called.

  constructor(target: T, ...args: any[]) {
    this.target = target;
  }

  // Use the constructor to set instance variables needed throughout sub validations.
  public validate(): boolean {
    if (this.validated) {
      throw new Error('cannot call validate multiple times');
    }

    this.doValidate();

    this.validated = true;
    return this.isValid;
  }

  public get isValid(): boolean {
    return this.validated && this.errors.length === 0;
  }

  protected abstract doValidate(): void;
  
  protected error(msg: string): void {
    this.errors.push(new Error(msg));
  }
}
