import { first } from 'lodash';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { KeyInfo } from '../../lib/MusicDisplay/helpers';

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
