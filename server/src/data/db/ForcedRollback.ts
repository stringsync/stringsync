export class ForcedRollback extends Error {
  constructor() {
    super('forced rollback');
    Object.setPrototypeOf(this, ForcedRollback.prototype);
  }
}
