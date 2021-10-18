import { NotationSettings } from '../Notation';

export type PersistentSettings = Pick<
  NotationSettings,
  'isFretboardVisible' | 'isAutoScrollPreferred' | 'isVideoVisible' | 'fretMarkerDisplay' | 'preferredLayout'
>;
