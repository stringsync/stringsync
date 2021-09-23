import { Interval, Note } from '@tonaljs/tonal';
import { Pitch } from '../music/Pitch';
import { Position } from './Position';
import { Tuning } from './Tuning';

export class Guitar {
  readonly tuning: Tuning;

  constructor(tuning: Tuning) {
    this.tuning = tuning;
  }

  getPitchAt(position: Position) {
    const openStringPitch = this.tuning.getPitchAt(position.string);
    const interval = Interval.fromSemitones(position.fret);
    const pitchStr = Note.transpose(openStringPitch.toFullyQualifiedString(), interval.toString());
    return Pitch.fromString(pitchStr);
  }
}
