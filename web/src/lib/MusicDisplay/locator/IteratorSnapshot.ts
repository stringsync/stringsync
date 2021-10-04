import { Cursor, MusicPartManagerIterator } from 'opensheetmusicdisplay';

export class IteratorSnapshot {
  static create(iterator: MusicPartManagerIterator) {
    return new IteratorSnapshot(iterator.clone());
  }

  private iterator: MusicPartManagerIterator;

  private constructor(iterator: MusicPartManagerIterator) {
    this.iterator = iterator;
  }

  clone() {
    return this.iterator.clone();
  }

  apply(cursor: Cursor) {
    cursor.iterator = this.clone();
    cursor.update();
  }
}
