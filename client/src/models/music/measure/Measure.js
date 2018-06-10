class Measure {
  constructor(timeSignature, slices, bar, spec) {
    this.slices = slices;
    this.bar = bar;
    this.spec = spec;
    this.type = 'MEASURE';
  }
};

export default Measure;
