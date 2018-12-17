import { FretMarker } from './FretMarker';
import { Note } from '../score/line/measure/note';
import { partition } from 'lodash';
import { IPosition } from '../../@types/position';

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

  public note: Note | null = null;
  public lit: Set<FretMarker> = new Set();
  public pressed: Set<FretMarker> = new Set();

  /**
   * The primary interface of Fretboard. This will take a maestro, and infer all of the
   * components that should be lit or pressed.
   */
  public updateFretMarkers(note: Note): void {
    if (this.note === note) {
      return;
    }

    const { measure } = note;

    if (!measure) {
      throw new Error('expected note to be hydrated');
    }

    const shouldLight = new Set(measure.positions.map(position => this.getFretMarker(position)));
    const shouldPress = new Set(note.positions.map(position => this.getFretMarker(position)));

    const shouldUnlight = Array.from(this.lit).filter(fretMarker => !shouldLight.has(fretMarker));
    const shouldUnpress = Array.from(this.pressed).filter(fretMarker => !shouldPress.has(fretMarker));

    shouldLight.forEach(fretMarker => fretMarker.light());
    shouldUnlight.forEach(fretMarker => fretMarker.hide());
    shouldPress.forEach(fretMarker => fretMarker.press());
    shouldUnpress.forEach(fretMarker => fretMarker.unpress());

    this.lit = shouldLight;
    this.pressed = shouldPress;
    this.note = note;
  }

  private getFretMarker(position: IPosition): FretMarker {
    return this.fretMarkers[position.str - 1][position.fret];
  }
}
