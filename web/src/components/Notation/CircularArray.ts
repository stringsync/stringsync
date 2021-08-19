import { isInteger } from 'lodash';

export class CircularArray<T> {
  public readonly capacity: number;

  private ndx = 0;
  private length = 0;
  private values: T[];

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new RangeError('capacity must be positive');
    }
    if (!isInteger(capacity)) {
      throw new TypeError('capacity must be an integer');
    }

    this.capacity = capacity;
    this.values = new Array<T>(capacity);
  }

  push(value: T) {
    this.values[this.ndx] = value;
    this.ndx = this.getNextIndex();
    this.length = Math.min(this.capacity, this.length + 1);
  }

  peek(): T | undefined {
    return this.values[this.ndx];
  }

  getValues(): T[] {
    if (this.length < this.capacity) {
      return this.values.slice(0, this.length);
    }
    // LRU ordering
    return [...this.values.slice(0, this.ndx).reverse(), ...this.values.slice(this.ndx).reverse()];
  }

  getLength(): number {
    return this.length;
  }

  private getNextIndex() {
    return (this.ndx + 1) % this.capacity;
  }
}
