export class Position {
  readonly fret: number;
  readonly string: number;

  constructor(fret: number, string: number) {
    this.fret = fret;
    this.string = string;
  }

  toString() {
    return JSON.stringify({ fret: this.fret, string: this.string });
  }
}
