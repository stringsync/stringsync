import { sortBy } from 'lodash';

const RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

/**
 * This class's purpose is to manage the prioritization of functions for requestAnimationFrame.
 * This is particularly useful when multiple systems need to call requestAnimationFrame and
 * execute consistently.
 */
class RafLoop {
  constructor() {
    this.isActive = false;
    this.specs = [];
    this.rafId = null;
  }

  /**
   * Pushes the rafSpec into the specs instance variable and then sorts it by precedence.
   * This function does not prevent multiple specs with the same name from being added.
   * 
   * @param {RafSpec} spec
   */
  add(spec) {
    this.specs.push(spec);
    this.specs = sortBy(this.specs, spec => spec.precedence);
  }

  /**
   * Removes all specs matching the name parameter.
   * 
   * @param {string} name 
   */
  remove(name) {
    this.specs = this.specs.filter(spec => spec.name !== name);
  }

  /**
   * Starts the raf loop.
   */
  start() {
    if (!this.isActive) {
      this.isActive = true;
      this._loop();
    }
  }

  /**
   * Stops the raf loop.
   */
  stop() {
    if (this.isActive) {
      this.isActive = false;
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * @private
   */
  _loop() {
    this._execSpecs();
    this.rafId = RAF(this._loop);
  }

  /**
   * @private
   */
  _execSpecs() {
    this.specs.forEach(spec => spec.callback());
  }
}

export default RafLoop;
