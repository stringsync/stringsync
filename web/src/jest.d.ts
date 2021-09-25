declare namespace jest {
  interface Matchers<R> {
    toRenderNoteTimes(note: string, numTimes: number): R;
    toRenderPosition(position: { fret: number; string: number }): R;
    toRenderNumPositions(numPositions: number): R;
  }
}
