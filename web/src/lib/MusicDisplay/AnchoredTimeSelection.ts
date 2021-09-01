export class AnchoredTimeSelection {
  static init(initialTimeMs: number) {
    return new AnchoredTimeSelection(initialTimeMs, initialTimeMs);
  }

  readonly id = Symbol();

  readonly anchorTimeMs: number;
  seekerTimeMs: number;

  constructor(anchorTimeMs: number, seekerTimeMs: number) {
    this.anchorTimeMs = anchorTimeMs;
    this.seekerTimeMs = seekerTimeMs;
  }

  update(timeMs: number) {
    this.seekerTimeMs = timeMs;
  }

  clone() {
    return new AnchoredTimeSelection(this.anchorTimeMs, this.seekerTimeMs);
  }
}
