import { Flow } from 'vexflow';

/**
 * Converts timeMs to ticks
 * 
 * @param {number} timeMs 
 * @param {number} tpm ticks per minute
 * @returns {number}
 */
const toTick = (timeMs, tpm) => tpm * ((timeMs / 1000) / 60);

/**
 * This class is the sole source of truth for time. It is used by invoking the setter on currentTimeMs.
 * It also has convenient getters for converting time from ms to ticks.
 */
class TimeKeeper {
  constructor(bpm, deadTimeMs) {
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
};

export default TimeKeeper;
