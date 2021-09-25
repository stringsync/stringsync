type Position = { fret: number; string: number };

type Style = 'fill' | 'stroke';

declare namespace jest {
  interface Matchers<R> {
    toRenderNoteTimes(note: string, numTimes: number): R;
    toRenderPosition(position: Position): R;
    toRenderNumPositions(numPositions: number): R;
    toHavePositionStyle(position: Position, style: Style, value: string);
  }
}
