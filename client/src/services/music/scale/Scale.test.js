import { Note } from 'services';
import { Scale, ScaleDegree, scales } from './';
import { forOwn } from 'lodash';

const KEYS = Note.ALL_LITERALS;

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
