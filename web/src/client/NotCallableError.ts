export class NotCallableError extends Error {
  constructor() {
    super('client is not callable');
  }
}
