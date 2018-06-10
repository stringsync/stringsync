class Measure {
  constructor(timeSignature, elements, bar, spec) {
    this.elements = elements;
    this.bar = bar;
    this.spec = spec;
    this.type = 'MEASURE';

    this._struct = undefined;
  }

  get struct() {
    if (this._struct) {
      return this._struct;
    }

    this._struct = this.elements.map(element => element.struct.raw);

    return this._struct;
  }
};

export default Measure;
