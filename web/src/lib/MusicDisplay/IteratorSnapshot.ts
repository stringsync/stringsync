import { MusicPartManagerIterator } from 'opensheetmusicdisplay';

export class IteratorSnapshot {
  static create(iterator: MusicPartManagerIterator) {
    return new IteratorSnapshot(iterator.clone());
  }

  private iterator: MusicPartManagerIterator;

  private constructor(iterator: MusicPartManagerIterator) {
    this.iterator = iterator;
  }

  get() {
    return this.iterator.clone();
  }
}