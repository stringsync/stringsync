import { Note } from 'services';
import { Scale, ScaleDegree, scales } from './';
import { times, forOwn, sample } from 'lodash';

const KEYS = Note.ALL_LITERALS;

const randomDegreeLiterals = () => {
  const scaleName = sample(Object.keys(scales));
  return scales[scaleName];
};

test('Scale.for', () => {
  KEYS.forEach(key => {
    forOwn(scales, (degreeLiterals, scaleName) => {
      const scale = Scale.for(key, scaleName);
      expect(scale.degrees).toHaveLength(degreeLiterals.length);
    });
  });
});

test('Scale.for with invalid scale names throws an error', () => {
  ['foo', 'bar', 'major', 'minor'].forEach(scaleName => {
    expect(() => Scale.for('A', scaleName)).toThrow();
  });
});

test('Scale.constructor sets the ScaleDegree scales to +this+', () => {
  const scale = Scale.for('A', 'chromatic');
  expect(scale.degrees).toHaveLength(12);

  scale.degrees.forEach(degree => {
    expect(degree.scale).toBe(scale);
  });
});

test('Scale.constructor creates a Note object from the key with an octave of 1', () => {
  Note.ALL_LITERALS.forEach(key => {
    const scale = new Scale(key, randomDegreeLiterals());
    expect(scale.key).toBeInstanceOf(Note);
    expect(scale.key.octave).toBe(1);
  });
});
