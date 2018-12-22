import { Note } from '../score/line/measure/note';
import { IPosition } from '../../@types/position';
import { compact } from 'lodash';
import { ISpec } from '../maestro';

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

  public cachedSpec: ISpec | null = null;
  public cachedIsJustPressed: boolean = false;
  public lit: Set<any> = new Set();
  public pressed: Set<any> = new Set();
  public justPressed: Set<any> = new Set();

  public add(fretMarker: any, position: IPosition) {
    const { fret, str } = position;
    this.fretMarkers[str - 1][fret] = fretMarker;
  }

  public remove(position: IPosition) {
    const { fret, str } = position;
    this.fretMarkers[str - 1][fret] = null;
  }

  /**
   * The primary interface of Fretboard. This will take a maestro, and infer all of the
   * components that should be lit or pressed.
   */
  public updateFretMarkers(spec: ISpec | null, tick: number): void {
    let notePositions: IPosition[] = [];
    let measurePositions: IPosition[] = [];
    let isJustPressed = false;

    if (spec && spec.note && spec.note.measure) {
      notePositions = spec.note.positions;
      measurePositions = spec.note.measure.positions;
      const start = spec.startTick;
      const stop = spec.stopTick;
      isJustPressed = tick < Math.min(start + 250, start + ((stop - start) * 0.5));
    }

    // Avoid heavy weight operations
    if (this.cachedSpec === spec && this.cachedIsJustPressed === isJustPressed) {
      return;
    }

    const shouldPress = new Set(notePositions.map(position => this.getFretMarker(position)));
    const shouldLight = new Set(measurePositions.map(position => this.getFretMarker(position)));

    const shouldUnpress = Array.from(this.pressed).filter(fretMarker => !shouldPress.has(fretMarker));
    const shouldUnlight = Array.from(this.lit).filter(fretMarker => !shouldLight.has(fretMarker));

    compact(Array.from(shouldLight)).forEach(fretMarker => fretMarker.props.light());
    compact(Array.from(shouldPress)).forEach(fretMarker => {
      if (isJustPressed) {
        fretMarker.props.justPress();
      } else {
        fretMarker.props.press();
      }
    });

    compact(shouldUnpress).forEach(fretMarker => fretMarker.props.unpress());
    compact(shouldUnlight).forEach(fretMarker => fretMarker.props.unlight());

    this.lit = shouldLight;
    this.pressed = shouldPress;
    this.cachedSpec = spec;
    this.cachedIsJustPressed = isJustPressed;
  }

  private getFretMarker(position: IPosition): any {
    return this.fretMarkers[position.str - 1][position.fret];
  }
}
