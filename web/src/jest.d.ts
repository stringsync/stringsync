declare namespace jest {
  interface Matchers<R> {
    toRenderNumPositions(numPositions: number): R;
    toRenderPosition(position: { fret: number; string: number }): R;
  }
}
