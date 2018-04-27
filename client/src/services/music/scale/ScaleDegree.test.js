import { Scale, ScaleDegree } from './';

test('ScaleDegree.constructor', () => {
  const scale = new Scale('A', []);

  ScaleDegree.LITERALS.forEach(literal => {
    const scaleDegree = new ScaleDegree(literal, scale);
    expect(scaleDegree.literal).toBe(literal);
    expect(scaleDegree.scale).toBe(scale);
  });
});

test('ScaleDegree.constructor allows scale to be undefined', () => {
  const scaleDegree = new ScaleDegree('1');
  expect(scaleDegree.literal).toBe('1');
  expect(scaleDegree.scale).toBeNull();
});

test('ScaleDegree.constructor disallows invalid literals', () => {
  const scale = new Scale('A', []);

  ['1%', 'b4', 'b1', 'foo', 'bar'].forEach(literal => {
    expect(() => new ScaleDegree(literal, scale)).toThrow();
  });
});
