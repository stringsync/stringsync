import { Maestro, ISpec } from './../maestro/Maestro';
import { FretMarker } from './FretMarker';
import { IPosition } from '../../@types/position';
import { Note } from '../score/line/measure/note';

const NUM_FRETS = 23;

export class Fretboard {
  public fretMarkers = [
    new Array(NUM_FRETS).fill(null),
    new Array(NUM_FRETS).fill(null),
    new Array(NUM_FRETS).fill(null),
    new Array(NUM_FRETS).fill(null),
    new Array(NUM_FRETS).fill(null),
    new Array(NUM_FRETS).fill(null)
  ];

  public lit: Set<FretMarker> = new Set();
  public pressed: Set<FretMarker> = new Set();

  /**
   * The primary interface of Fretboard. This will take a maestro, and infer all of the
   * components that should be lit, pressed, justPressed, or suggested.
   *
   * @param maestro
   */
  public updateMarkers(note: Note): void {
    const { measure } = note;

    if (!measure) {
      throw new Error('expected note to be hydrated');
    }

    const lit = measure.positions;
    const pressed = note.positions;
  }
}
