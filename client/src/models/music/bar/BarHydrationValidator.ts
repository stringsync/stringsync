import { AbstractValidator } from 'utilities';
import { Bar } from './Bar';

export class BarHydrationValidator extends AbstractValidator<Bar> {
  public readonly staveNote: Vex.Flow.BarNote;
  public readonly tabNote: Vex.Flow.BarNote;

  constructor(bar: Bar, staveNote: Vex.Flow.BarNote, tabNote: Vex.Flow.BarNote) {
    super(bar);

    this.staveNote = staveNote;
    this.tabNote = tabNote;
  }

  protected doValidate(): void {
    if (this.target.getType() !== this.staveNote.getType()) {
      this.error('expected bar kind to be the staveNote type');
    } else if (this.target.getType() !== this.tabNote.getType()) {
      this.error('expected bar kind to be the tabNote type');
    }
  }
}