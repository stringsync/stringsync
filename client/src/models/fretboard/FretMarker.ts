export type FretMarkerStates = 'LIT' | 'PRESSED' | 'HIDDEN' | 'JUST_PRESSED' | 'SUGGESTED';

export class FretMarker {
  public static STATES: FretMarkerStates[] = ['HIDDEN', 'LIT', 'JUST_PRESSED', 'PRESSED', 'SUGGESTED'];
  
  public readonly position: Guitar.IPosition;
  public readonly reactComponent: any;

  constructor(reactComponent: any, position: Guitar.IPosition) {
    this.reactComponent = reactComponent;
    this.position = position;
  }

  public setMarkerState(state: FretMarkerStates) {
    this.reactComponent.props.setMarkerState(state);
  }
}
