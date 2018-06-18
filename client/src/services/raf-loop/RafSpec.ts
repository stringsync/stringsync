export type RafLoopCallback = (dt?: number) => any;

/**
 * RafSpecs are used by the RafLoop to execute callback functions in a deterministic manner.
 */
export class RafSpec {
  public readonly name: string;
  public readonly precedence: number;
  public readonly callback: RafLoopCallback;

  constructor(name: string, precedence: number, callback: RafLoopCallback) {
    this.name = name;
    this.precedence = precedence;
    this.callback = callback;
  }
};
