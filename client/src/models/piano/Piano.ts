import { PianoKey, PianoKeyStates } from './PianoKey';
import { Maestro } from 'services';
import { compact } from 'lodash';
import { Chord } from '../music';

export class Piano {
  public pianoKeysByNoteName: { [noteName: string]: PianoKey } = {};

  public pressed: Set<PianoKey> = new Set();

  public update(maestro: Maestro): void {
    // Arguments for Fretboard.prototype.sync
    let pressed: string[] = [];

    const element = maestro.state.note;

    if (!element) {
      this.sync(pressed);
      return;
    } else if (!element.measure) {
      throw new Error('measure elements must be associated with a measure to update fretboard');
    }

    if (element instanceof Chord) {
      pressed = element.notes.map(note => note.toString());
    } else if (element.type === 'NOTE') {
      pressed = [element.toString()];
    }

    this.sync(pressed);
  }

  /**
   * Inserts the fretMarker in the fretMarkers instance variable.
   */
  public add(pianoKey: PianoKey) {
    this.pianoKeysByNoteName[pianoKey.noteName] = pianoKey;
  }

  public remove(noteName: string) {
    delete this.pianoKeysByNoteName[noteName];
  }

  /**
   * Orchestrates syncing with the React components attached to the PianoKey model.
   * 
   * @param lit 
   * @param pressed
   */
  private sync(pressedNoteNames: string[]) {
    const shouldPress = this.mapKeys(pressedNoteNames);

    this.pressed = this.doSync(shouldPress, 'PRESSED');
  }

  private mapKeys(noteNames: string[]): PianoKey[] {
    return compact(noteNames.map(noteName => this.pianoKeysByNoteName[noteName]));
  }

  /**
   * Performs the actual syncing mechanism which updates the state on the fret markers' react
   * components.
   * 
   * @param fretMarkers 
   * @param state 
   */
  private doSync(pianoKeys: PianoKey[], state: PianoKeyStates): Set<PianoKey> {
    const next: Set<PianoKey> = new Set();

    let curr: Set<PianoKey>;
    switch (state) {
      case 'PRESSED':
        curr = this.pressed;
        break

      default:
        return next;
    }

    pianoKeys.forEach(pianoKey => {
      if (curr.has(pianoKey)) {
        pianoKey.setKeyState(state);
      }

      next.add(pianoKey);
    });

    // Should hide these components
    Array.from(curr).filter(pianoKey => !next.has(pianoKey)).forEach(pianoKey => {
      pianoKey.setKeyState('HIDDEN');
    });

    return next;
  }
}
