export type PianoKeyStates = 'LIT' | 'PRESSED' | 'HIDDEN';

export class PianoKey {
  public static STATES = ['LIT', 'PRESSED', 'HIDDEN'];

  public readonly noteName: string;
  public readonly reactComponent: any;

  constructor(reactComponent: any, noteName: string) {
    this.reactComponent = reactComponent;
    this.noteName = noteName;
  }

  public setKeyState(state: PianoKeyStates) {
    this.reactComponent.props.setMarkerState(state);
  }
}
