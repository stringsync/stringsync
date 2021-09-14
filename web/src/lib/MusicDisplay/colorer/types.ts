export interface ColorOp {
  perform(color: string): void;
  undo(): void;
}
