import { Time } from 'services';
import { AbstractObservable } from 'utilities';
import { isEqual } from 'lodash';
import { Vextab } from 'models/vextab';
import { TickMap } from './TickMap';
import { MeasureElement } from 'models';

interface IMaestroState {
  time: Time;
  start: number | null;
  stop: number | null;
  note: MeasureElement | null;
}

const getNullState = (time: Time): IMaestroState => ({
  note: null,
  start: null,
  stop: null,
  time
});

/**
 * This class's purpose is to provide a single interface for callers to invoke an update on
 * all of the backend models. If a caller asynchronously invokes an update while the Maestro
 * instance is still computing, it will be ignored.
 */
export class Maestro extends AbstractObservable {
  public deadTime: Time;
  public bpm: number;
  public tickMap: TickMap | null = null;
  
  private isUpdating: boolean = false;
  private $vextab: Vextab | null = null;
  private $state: IMaestroState;
  private $time: Time;

  constructor(deadTimeMs: number, bpm: number) {
    super();

    this.deadTime = new Time(deadTimeMs, 'ms');
    this.bpm = bpm;
    this.$time = new Time(0, 'ms');
    this.state = getNullState(this.$time.clone);
  }

  public set time(time: Time) {
    if (time.bpm) {
      throw new Error('Expected bpm to be undefined. Set bpm in maestro instead.');
    }

    this.$time = time.clone;
    this.$time.bpm = this.bpm;

    this.update();
  }

  public get state() {
    return this.$state;
  }

  public set state(state: IMaestroState) {
    this.$state = state;
    this.notify();
  }

  public get vextab() {
    return this.$vextab;
  }

  public set vextab(vextab: Vextab | null) {
    if (!vextab) {
      this.tickMap = null;
    } else if (vextab !== this.vextab) {
      const deadTime = this.deadTime;
      deadTime.bpm = this.bpm;
      this.tickMap = new TickMap(vextab, deadTime.tick);
    }
    
    this.$vextab = vextab;
  }

  /**
   * The primary interface that event handlers should call to update the backend
   * models.
   */
  public update() {
    if (this.isUpdating) {
      return;
    }

    this.isUpdating = true;

    try {
      this.doUpdate();
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Contains the logic of doing the update. It will call the state's setter function,
   * which will notify observers of this class.
   * 
   * @private
   */
  private doUpdate() {
    const time = this.$time.clone;

    let nextState: IMaestroState;

    const { start, stop } = this.state;
    const shouldFetchData = (
      start === null    ||
      stop === null     ||
      time.tick < start ||
      time.tick >= stop
    )

    try {
      if (shouldFetchData) {
        // typescript bang operator usage:
        //  this.tickMap may be null, but an error will be thrown and caught if it is.
        //  TickMap.prototype.fetch may also throw an error, so that case is handled as well.
        nextState = { time, ...this.tickMap!.fetch(time.tick) };
      } else {
        nextState = Object.assign({}, this.state, { time });
      }
    } catch (error) {
      if (window.ss.debug) {
        console.error(error);
      }
      nextState = getNullState(time);
    }

    this.changed = !isEqual(this.state, nextState);
    this.state = nextState;
  }
}
