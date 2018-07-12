import { Time } from 'services';
import { AbstractObservable } from 'utilities';
import { isEqual } from 'lodash';
import { Line, Measure, Note, Rest } from 'models/music';
import { Vextab } from 'models/vextab';
import { TickMap, ITickData } from './TickMap';
import { MeasureElement } from 'models';

interface IMaestroState {
  time: Time;
  start: number | null;
  stop: number | null;
  line: Line | null;
  measure: Measure | null;
  note: MeasureElement | null;
}

const getNullState = (time: Time): IMaestroState => ({
  line: null,
  measure: null,
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
  
  private isUpdating: boolean = false;
  private tickMap: TickMap | null = null;
  private $vextab: Vextab | null = null;
  private $state: IMaestroState;
  private $time: Time;

  constructor(deadTimeMs: number, bpm: number) {
    super();

    this.deadTime = new Time(deadTimeMs, 'ms');
    this.bpm = bpm;
    this.time = new Time(0, 'ms');

    this.state = getNullState(this.$time.clone);
  }

  public set time(time: Time) {
    if (time.bpm) {
      throw new Error('Expected bpm to be undefined. Set bpm in maestro instead.');
    }

    this.$time = time.clone;
    this.$time.bpm = this.bpm;
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
      this.tickMap = new TickMap(vextab);
    }
    
    this.$vextab = vextab;
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
   * Contains the logic of doing the update. It will call the state's setter function,
   * which will notify observers of this class.
   * 
   * @private
   */
  private doUpdate() {
    const time = this.$time.clone; // ensures that this time is constant during this function call
    const deadTime = this.deadTime.clone
    deadTime.bpm = this.bpm;

    let nextState: IMaestroState;

    try {
      // typescript bang operator usage:
      //  this.tickMap may be null, but an error will be thrown and caught if it is.
      //  TickMap.prototype.fetch may also throw an error, so that case is handled as well.
      nextState = { time, ...this.tickMap!.fetch(time.tick + deadTime.tick) };
    } catch (error) {
      console.warn(error);
      nextState = getNullState(time);
    }

    this.changed = !isEqual(this.state, nextState);

    this.state = nextState;
  }
}
