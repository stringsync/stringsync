import { Note } from 'services';
import { Scale, ScaleDegree, scales } from './';

const KEYS = Note.ALL_LITERALS;

test('Scale factory', () => {
  KEYS.forEach(key => {
    Object.keys(scales).forEach(scaleName => {
      Scale.for(key, scaleName);
    });
  });
});
