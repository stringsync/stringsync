export type FretMarkerStates = 'LIT' | 'PRESSED' | 'HIDDEN' | 'JUST_PRESSED' | 'SUGGESTED';

export class FretMarker {
  public static STATES: FretMarkerStates[] = ['HIDDEN', 'LIT', 'JUST_PRESSED', 'PRESSED', 'SUGGESTED'];
}
