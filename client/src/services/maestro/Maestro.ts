import { Time } from 'services';
import { AbstractObservable } from 'utilities';
import { isEqual } from 'lodash';
import { Vextab, VextabElement } from 'models/vextab';
import { TickMap } from './TickMap';
import { Fretboard } from 'models';
import { Piano } from 'models';
import { Flow } from 'vexflow';

interface IMaestroState {
  time: Time;
  loopStart: Time;
  loopEnd: Time;
  start: number | null; // start tick time that the note is valid
  stop: number | null;  // stop tick time that the note is valid
  note: VextabElement | null;
}

const getNullState = (time: Time, loopStart: Time, loopEnd: Time): IMaestroState => ({
  loopEnd,
  loopStart,
  note: null,
  start: null,
  stop: null,
  time
});

const DEFAULT_TUNING = new Flow.Tuning();

/**
 * This class's purpose is to provide a single interface for callers to invoke an update on
 * all of the backend models. If a caller asynchronously invokes an update while the Maestro
 * instance is still computing, it will be ignored.
 */
export class Maestro extends AbstractObservable {
  
  public bpm: number;
  public durationMs: Time;
  public tickMap: TickMap | null = null;
  public fretboard: Fretboard | null = null;
  public piano: Piano | null = null;
  public tuning = DEFAULT_TUNING;
  
  private isUpdating: boolean = false;
  private $vextab: Vextab | null = null;
  private $state: IMaestroState;
  private $prevState: IMaestroState;
  private $time: Time;
  private $loopStart: Time;
  private $loopEnd: Time;
  private $deadTime: Time;

  constructor(deadTimeMs: number, bpm: number, durationMs: number) {
    super();

    this.$deadTime = new Time(deadTimeMs, 'ms', bpm);
    this.bpm = bpm;
    this.durationMs = new Time(durationMs, 'ms');

    this.$time = new Time(0, 'ms', this.bpm);
    this.$loopStart = new Time(0, 'ms', this.bpm);
    this.$loopEnd = new Time(durationMs, 'ms', this.bpm);

    this.state = getNullState(this.$time.clone, this.$loopStart.clone, this.$loopEnd.clone);
    this.$prevState = getNullState(this.$time.clone, this.$loopStart.clone, this.$loopEnd.clone);
  }

  public set time(time: Time) {
    if (time.bpm) {
      throw new Error('Expected bpm to be undefined. Set bpm in maestro instead.');
    }

    this.$time = time.clone;
    this.$time.bpm = this.bpm;

    this.update();
  }

  public get deadTime()  {
    return this.$deadTime;
  }

  public set deadTime(deadTime: Time) {
    this.$deadTime = deadTime;
    this.$deadTime.bpm = this.bpm;

    if (this.tickMap && this.vextab) {
      this.tickMap = new TickMap(this.vextab, this.$deadTime.tick);

      try {
        this.tickMap.compute();
      } catch (error) {
        // The tickMap may not be ready to compute, hand off the responsibility to
        // the Renderer component.
        console.error(error);
      }
    }
  }

  public set loopStart(loopStart: Time) {
    if (loopStart.bpm) {
      throw new Error('Expected bpm to be undefined. Set bpm in maestro instead.');
    }

    this.$loopStart = loopStart.clone;
    this.$loopStart.bpm = this.bpm;
    
    this.update();
  }

  public set loopEnd(loopEnd: Time) {
    if (loopEnd.bpm) {
      throw new Error('Expected bpm to be undefined. Set bpm in maestro instead.');
    }

    this.$loopEnd = loopEnd.clone;
    this.$loopEnd.bpm = this.bpm;
    
    this.update();
  }

  public get state() {
    return this.$state;
  }

  public set state(state: IMaestroState) {
    this.$prevState = this.$state;
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

  public get prevState() {
    return this.$prevState;
  }

  /**
   * The primary interface that event handlers should call to update the backend
   * models.
   */
  public update(forceChanged = false) {
    if (this.isUpdating) {
      return;
    }

    this.isUpdating = true;

    try {
      const nextState = this.nextState;
      this.changed = forceChanged || !isEqual(this.state, nextState);
      this.state = nextState;
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
  private get nextState(): IMaestroState {
    const time = this.$time.clone;
    const loopStart = this.$loopStart.clone;
    const loopEnd = this.$loopEnd.clone;

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
        nextState = { time, loopStart, loopEnd, ...this.tickMap!.fetch(time.tick) };
      } else {
        nextState = Object.assign({}, this.state, { time, loopStart, loopEnd });
      }
    } catch (error) {
      // Potentially dangerous! Uncomment the following lines to debug in non productin envs.
      // if (window.ss.debug) {
      //   console.error(error);
      // }
      nextState = getNullState(time, loopStart, loopEnd);
    }

    return nextState;
  }
}
