import { Time } from 'services';
import { AbstractObservable } from 'utilities';

/**
 * This class's purpose is to provide a single interface for callers to invoke an update on
 * all of the backend models. If a caller asynchronously invokes an update while the Maestro
 * instance is still computing, it will be ignored.
 */
export class Maestro extends AbstractObservable {
  public deadTime: Time;
  public bpm: number;

  private isUpdating: boolean = false;
  private $time: Time;

  constructor(deadTimeMs: number, bpm: number) {
    super();

    this.deadTime = new Time(deadTimeMs, 'ms');
    this.bpm = bpm;
  }

  public get time() {
    return this.$time;
  }

  public set time(time: Time) {
    if (time.bpm) {
      throw new Error('Expected bpm to be undefined. Set bpm in maestro instead.');
    }

    this.$time = time.clone;
    this.$time.bpm = this.bpm;
  }

  /**
   * The primary interface that event handlers should call to update the backend
   * models.
   */
  public update() {
    if (this.isUpdating) {
      throw new Error('called Maestro.prototype.update in the middle of an update');
    }

    this.isUpdating = true;

    try {
      this.doUpdate();
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Contains the logic of doing the update.
   * 
   * @private
   */
  private doUpdate() {
    this.notify();
  }
}
