import { Flow } from 'vexflow';

/**
 * Converts timeMs to ticks
 * 
 * @param {number} timeMs 
 * @param {number} tpm ticks per minute
 * @returns {number}
 */
const toTick = (timeMs: number, tpm: number) => tpm * ((timeMs / 1000) / 60);

/**
 * This class is the sole source of truth for time. It is used by invoking the setter on currentTimeMs.
 * It also has convenient getters for converting time from ms to ticks.
 */
export class TimeKeeper {
  public currentTimeMs: number = 0;
  public bpm: number;
  public deadTimeMs: number;

  constructor(bpm: number, deadTimeMs: number) {
    this.currentTimeMs = 0;
    this.bpm = bpm;
    this.deadTimeMs = deadTimeMs;
  }

  get tpm() {
    return this.bpm * (Flow.RESOLUTION / 4);
  }

  get currentTick() {
    return toTick(this.currentTimeMs, this.tpm);
  }

  get clone() {
    const clone = new TimeKeeper(this.bpm, this.deadTimeMs);
    clone.currentTimeMs = this.currentTimeMs;
    return clone;
  }
};
