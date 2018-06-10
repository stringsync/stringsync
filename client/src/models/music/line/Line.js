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
    this.number = number;
    this.measures = measures;
    this.type = 'LINE';

    this._struct = undefined;
  }

  /**
   * @returns {VextabStruct[]}
   */
  get struct() {
    if (this._struct) {
      return this._struct;
    }

    // notes are measure struct!
    const notes = this.measures.reduce((measureStructs, measure) => {
      return measureStructs.concat(measure.struct);
    }, []);
    const options = this.measures.length === 0 ? [] : this.measures[0].spec.struct.raw;

    this._struct = {
      element: 'tabstave',
      options,
      notes,
      text: []
    }

    return this._struct;
  }
}

export default Line;
