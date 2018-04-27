import { Note } from 'services';
import { Scale, ScaleDegree, scales } from './';

const KEYS = Note.ALL_LITERALS;

test('Scale.for', () => {
  KEYS.forEach(key => {
    Object.keys(scales).forEach(scaleName => {
      Scale.for(key, scaleName);
    });
  });
});

test('Scale.for with invalid scale names throws an error', () => {
  ['foo', 'bar', 'major', 'minor'].forEach(scaleName => {
    expect(() => Scale.for('A', scaleName)).toThrow();
  });
});