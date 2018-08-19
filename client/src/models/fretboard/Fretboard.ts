import { FretMarker } from './FretMarker';
import { Maestro, Time } from 'services';
import { compact, get } from 'lodash';
import { FretMarkerStates } from 'models';

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

  public lit:         Set<FretMarker> = new Set();
  public pressed:     Set<FretMarker> = new Set();
  public justPressed: Set<FretMarker> = new Set();

  // TODO: Handle justPressed and pressed in ties and slurs
  /**
   * The primary interface of Fretboard. This will take a maestro, and infer all of the
   * components that should be lit, pressed, justPressed, or suggested.
   * 
   * @param maestro 
   */
  public update(maestro: Maestro): void {
    // Arguments for Fretboard.prototype.sync
    let lit: Guitar.IPosition[] = [];
    let pressed: Guitar.IPosition[] = [];
    let justPressed = false;

    const element = maestro.state.note;

    if (!element) {
      this.sync(lit, pressed, justPressed);
      return;
    } else if (!element.measure) {
      throw new Error('measure elements must be associated with a measure to update fretboard');
    }

    lit = element.measure.positions;
    pressed = element.type === 'NOTE' || element.type === 'CHORD' ? element.positions : [];

    // compute justPressed, which is the the pressed notes
    const { start, stop } = maestro.state;
    if (typeof start === 'number' && typeof stop === 'number') {
      const threshold = Math.min(start + 250, start + ((stop - start) * 0.5))
      justPressed = maestro.state.time.tick < threshold; 
    }
  
    this.sync(lit, pressed, justPressed);
  }

  /**
   * Inserts the fretMarker in the fretMarkers instance variable.
   */
  public add(fretMarker: FretMarker) {
    const { fret, str } = fretMarker.position;
    this.fretMarkers[str - 1][fret] = fretMarker;
  }

  public remove(position: Guitar.IPosition) {
    const { fret, str } = position;
    this.fretMarkers[str - 1][fret] = null;
  }

  /**
   * Orchestrates syncing with the React components attached to the FretMarker and
   * GuitarString models.
   * 
   * @param lit 
   * @param pressed 
   * @param justPressed 
   */
  private sync(litPositions: Guitar.IPosition[], pressedPositions: Guitar.IPosition[], justPressed: boolean) {

    // These components should light/press/justPress, and they might already be in that state.
    const shouldLight     = this.mapMarkers(litPositions);
    const shouldPress     = justPressed ? [] : this.mapMarkers(pressedPositions);
    const shouldJustPress = justPressed ? this.mapMarkers(pressedPositions) : [];

    this.lit         = this.doSync(shouldLight, 'LIT');
    this.pressed     = this.doSync(shouldPress, 'PRESSED');
    this.justPressed = this.doSync(shouldJustPress, 'JUST_PRESSED');
  }

  private mapMarkers(positions: Guitar.IPosition[]): FretMarker[] {
    return compact(positions.map(({ str, fret }) => get(this.fretMarkers[str - 1], fret)));
  }

  /**
   * Performs the actual syncing mechanism which updates the state on the fret markers' react
   * components.
   * 
   * @param fretMarkers 
   * @param state 
   */
  private doSync(fretMarkers: FretMarker[], state: FretMarkerStates): Set<FretMarker> {
    const next: Set<FretMarker> = new Set();

    let curr: Set<FretMarker>;
    switch (state) {
      case 'LIT':
        curr = this.lit;
        break

      case 'PRESSED':
        curr = this.pressed;
        break
      
      case 'JUST_PRESSED':
        curr = this.justPressed;
        break
      
      default:
        return next;
    }

    fretMarkers.forEach(fretMarker => {
      if (curr.has(fretMarker)) {
        fretMarker.setMarkerState(state);
      }

      next.add(fretMarker);
    });

    // Should hide these components
    Array.from(curr).filter(fretMarker => !next.has(fretMarker)).forEach(fretMarker => {
      fretMarker.setMarkerState('HIDDEN');
    });

    return next;
  }
}
