import { AbstractValidator } from 'utilities';
import { Bar } from './Bar';

export class BarHydrationValidator extends AbstractValidator<Bar> {
  public readonly barNote: Vex.Flow.BarNote;

  constructor(bar: Bar, barNote: Vex.Flow.BarNote) {
    super(bar);

    this.barNote = barNote;
  }

  protected doValidate(): void {
    if (this.target.kind !== this.barNote.getType()) {
      this.error('expected bar kind to be the barNote type');
    }
  }
}