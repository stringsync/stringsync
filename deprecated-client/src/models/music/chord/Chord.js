class Chord {
  /**
   * @param {Note[]} notes 
   * @param {VextabStruct} struct 
   */
  constructor(notes, struct) {
    this.notes = notes;
    this.struct = struct;
    this.type = 'CHORD';
  }
}

export default Chord;
