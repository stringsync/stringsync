export class MissingCasterError extends Error {
  constructor(type: string) {
    super(`could not cast to ${type}`);
  }
}
