export class ForcedRollback extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ForcedRollback.prototype);
  }
}
