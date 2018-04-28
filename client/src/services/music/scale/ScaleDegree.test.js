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
    [['1', new Scale('A', [])], ['1', new Scale('A', [])], true],
    [['b3', new Scale('Db', [])], ['b3', new Scale('C#', [])], true],
    [['1', new Scale('A', [])], ['1', new Scale('B', [])], false],
    [['1', new Scale('A', [])], ['b2', new Scale('A', [])], false],
  ];

  cases.forEach(testCase => {
    const [args1, args2, expectation] = testCase;
    const scaleDegree1 = new ScaleDegree(...args1);
    const scaleDegree2 = new ScaleDegree(...args2);

    expect(scaleDegree1.isEquivalent(scaleDegree1)).toBe(true);
    expect(scaleDegree2.isEquivalent(scaleDegree2)).toBe(true);
    expect(scaleDegree1.isEquivalent(scaleDegree2)).toBe(expectation);
    expect(scaleDegree2.isEquivalent(scaleDegree1)).toBe(expectation);
  });
});

test('ScaleDegree.prototype.modifier', () => {
  ScaleDegree.LITERALS.forEach(literal => {
    const scaleDegree = new ScaleDegree(literal, randomScale());

    let expectation;
    if (literal.startsWith('#')) {
      expectation = '#';
    } else if (literal.startsWith('b')) {
      expectation = 'b';
    } else {
      expectation = '';
    }

    expect(scaleDegree.modifier).toBe(expectation);
  })
});

test