import { Measure } from 'models';

class Line {
  /**
   * The number is essentially the id of the line. It is used to marry the canvas element
   * with the model instance.
   * 
   * @param {number} number 
   * @param {Measure[]} measures 
   */
  constructor(number, measures) {
    this.number = number
    this.measures = measures;
  }
}

export default Line;
