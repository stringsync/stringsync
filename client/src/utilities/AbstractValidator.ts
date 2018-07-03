export abstract class AbstractValidator {
  public readonly isValid: boolean = false;

  // Should not take any arguments, but use the constructor to set the instance variables
  // that will be used in the private sub validators.
  public abstract validate(): void;
}
