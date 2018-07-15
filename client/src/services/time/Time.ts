import { Flow } from 'vexflow';

export type TimeUnits = 'ms' | 's' | 'min';

/**
 * This class is used to convert time from milliseconds to ticks. The caller can optionally
 * pass in bpm. However, if not supplied, any computation that requires bpm to be defined
 * will throw an error.
 */
export class Time {
  public readonly ms: number;  // milliseconds

  public bpm?: number; // beats per minute

  constructor(value: number, units: TimeUnits, bpm?: number) {
    if (typeof bpm === 'number' && bpm <= 0) {
      throw new RangeError('expected bpm to be a number greater than 0 or undefined');
    }
  
    switch (units) {
      case 'ms':
        this.ms = value;
        break;
      case 's':
        this.ms = value * 1000;
        break;
      case 'min':
        this.ms = (value * 60) * 1000;
        break;
      default:
        throw Error(`invalid units: ${units}`);
    }

    this.bpm = bpm;
  }

  /**
   * Converts beats per minute to ticks per minute.
   */
  public get tpm() {
    if (!this.bpm) {
      throw new Error('cannot compute ticks per minute without specifying bpm');
    }

    return this.bpm * (Flow.RESOLUTION / 4);
  }

  /**
   * Returns the number of seconds.
   */
  public get s() {
    return this.ms / 1000;
  }

  /**
   * Returns the number of minutes.
   */
  public get min() {
    return this.s / 60;
  }

  /**
   * Returns the number of ticks.
   */
  public get tick() {
    return this.tpm * this.min;
  }

  /**
   * Returns an identical Time instance.
   */
  public get clone(): Time {
    return new Time(this.ms, 'ms', this.bpm);
  }
}
