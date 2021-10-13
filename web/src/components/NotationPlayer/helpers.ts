import { first } from 'lodash';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { KeyInfo } from '../../lib/MusicDisplay/helpers';
import { NumberRange } from '../../util/NumberRange';

export const getKeyInfo = (musicDisplay: MusicDisplay | null): KeyInfo | null => {
  if (!musicDisplay) {
    return null;
  }
  return (
    musicDisplay.getCursor().cursorSnapshot?.getKeyInfo() ||
    first(musicDisplay.getMeta().cursorSnapshots)?.getKeyInfo() ||
    null
  );
};

export const extendRanges = (src: NumberRange, dst: NumberRange): NumberRange => {
  const start = src.start < dst.start ? src.start : dst.start;
  const end = src.end > dst.end ? src.end : dst.end;
  return NumberRange.from(start).to(end);
};
