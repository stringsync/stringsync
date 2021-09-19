import { DurationValue } from './types';

export class Duration {
  readonly value: DurationValue;

  constructor(value: DurationValue) {
    this.value = value;
  }
}
