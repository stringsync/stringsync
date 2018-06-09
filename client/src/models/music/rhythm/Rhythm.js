class Rhythm {
  constructor(value, dot, tuplet) {
    this.value = value;
    this.dot = dot;
    this.tuplet = tuplet;
    this.type = 'RHYTHM';
  }

  clone() {
    return new Rhythm(this.value, this.dot, this.tuplet);
  }
}

export default Rhythm;
