// Conversions to milliseconds
const ms = (v: number) => v;
const sec = (v: number) => ms(v * 1000);
const min = (v: number) => sec(v * 60);
const hr = (v: number) => min(v * 60);
const day = (v: number) => hr(v * 24);

export class Duration {
  static ms(v: number) {
    return new Duration(ms(v));
  }

  static sec(v: number) {
    return new Duration(sec(v));
  }

  static min(v: number) {
    return new Duration(min(v));
  }

  static hr(v: number) {
    return new Duration(hr(v));
  }

  static day(v: number) {
    return new Duration(day(v));
  }

  private readonly _ms: number;

  private constructor(ms: number) {
    this._ms = ms;
  }

  eq(duration: Duration) {
    return this.ms === duration.ms;
  }

  get ms() {
    return this._ms;
  }

  get sec() {
    return this.ms / 1000;
  }

  get min() {
    return this.sec / 60;
  }

  get hr() {
    return this.min / 60;
  }

  get day() {
    return this.hr / 24;
  }
}
