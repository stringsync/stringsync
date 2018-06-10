import { Note } from 'models';

class Key {
  /**
   * @param {Note} note 
   */
  constructor(note) {
    this.note = note;
    this.type = 'KEY';
  }

  /**
   * @returns {string}
   */
  toString() {
    this.note.toString();
  }
}

export default Key;
