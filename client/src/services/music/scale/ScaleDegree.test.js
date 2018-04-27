import { Scale, ScaleDegree } from './';
import { Note, scales } from 'services';
import { times, sample, forOwn } from 'lodash';

const randomScale = () => {
  const key = sample(Note.ALL_LITERALS);
  const scaleName = sample(Object.keys(scales));
  return Scale.for(key, scaleName);
};

test('ScaleDegree.constructor', () => {
  ScaleDegree.LITERALS.forEach(literal => {
    const scale = randomScale()
    const scaleDegree = new ScaleDegree(literal, scale);
    expect(scaleDegree.literal).toBe(literal);
    expect(scaleDegree.scale).toBe(scale);
  });
});

test('ScaleDegree.constructor disallows invalid literals', () => {
  ['1%', 'b4', 'b1', 'foo', 'bar'].forEach(literal => {
    const scale = randomScale();
    expect(() => new ScaleDegree(literal, scale)).toThrow();
  });
});

test('ScaleDegree.constructor makes the scale property immutable', () => {
  const scale = randomScale();
  const scaleDegree = new ScaleDegree('1', scale);
  expect(() => scaleDegree.scale = randomScale()).toThrow();
});

test('ScaleDegree.prototype.key returns the scale key', () => {
  const scale = randomScale();
  const scaleDegree = new ScaleDegree('1', scale);
  expect(scaleDegree.key).toBe(scale.key);

  const key = 'hello world'
  scale.key = key;
  expect(scaleDegree.key).toBe(scale.key);
});

test('ScaleDegree.prototype.value fetches from the ScaleDegree.VALUES_BY_LITERAL object', () => {
  forOwn(ScaleDegree.VALUES_BY_LITERAL, (value, literal) => {
    const scale = randomScale();
    const scaleDegree = new ScaleDegree(literal, value);
    expect(scaleDegree.value).toBe(value);
  });
});

test('ScaleDegree.prototype.isEquivalent', () => {
  // Arrays of this ScaleDegree constructor args, other ScaleDegree constructor args,
  // and expectation.
  const cases = [
    [[], [], true],
    [[], [], true],
    [[], [], true],
    [[], [], true],
    [[], [], false],
    [[], [], false],
    [[], [], false],
    [[], [], false]
  ];

  fail();
});