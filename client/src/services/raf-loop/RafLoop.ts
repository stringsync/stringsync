import { sortBy } from 'lodash';
import { RafSpec } from './RafSpec';

const RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

/**
 * This class's purpose is to manage the prioritization of functions for requestAnimationFrame.
 * This is particularly useful when multiple systems need to call requestAnimationFrame and
 * execute consistently.
 */
export class RafLoop {
  public isActive: boolean = false;
  public specs: RafSpec[];
  public rafId: number | null;

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
  public add(spec: RafSpec) {
    this.specs.push(spec);
    this.specs = sortBy(this.specs, (rafSpec: RafSpec) => rafSpec.precedence);
  }

  /**
   * Removes all specs matching the name parameter.
   * 
   * @param {string} name 
   */
  public remove(name: string) {
    this.specs = this.specs.filter(spec => spec.name !== name);
  }

  /**
   * Starts the raf loop.
   */
  public start() {
    if (!this.isActive) {
      this.isActive = true;
      this.loop();
    }
  }

  /**
   * Stops the raf loop.
   */
  public stop() {
    if (this.isActive) {
      this.isActive = false;
      
      if (typeof this.rafId === 'number') {
        window.cancelAnimationFrame(this.rafId);
      }

      this.rafId = null;
    }
  }

  /**
   * Executes each spec's callback then loops again.
   * 
   * @private
   */
  private loop = () => {
    this.specs.forEach(spec => spec.callback());
    this.rafId = RAF(this.loop);
  }
}
