import { FretMarker } from './FretMarker';
import { GuitarString } from './GuitarString';

export type FretboardComponent = FretMarker | GuitarString;

const NUM_FRETS = 23;
const NUM_STRINGS = 6;

export class Fretboard {
  public fretMarkers = [
    new Array(NUM_FRETS).fill(null),
    new Array(NUM_FRETS).fill(null),
    new Array(NUM_FRETS).fill(null),
    new Array(NUM_FRETS).fill(null),
    new Array(NUM_FRETS).fill(null),
    new Array(NUM_FRETS).fill(null)
  ]
  public guitarStrings = new Array(NUM_STRINGS).fill(null);

  public lit:         FretboardComponent[] = [];
  public pressed:     FretboardComponent[] = [];
  public justPressed: FretboardComponent[] = [];
  public suggested:   FretboardComponent[] = [];
}
