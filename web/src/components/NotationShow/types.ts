import { NotationSettings } from '../Notation';

export type PersistentSettings = Pick<
  NotationSettings,
  | 'isFretboardVisible'
  | 'isAutoscrollPreferred'
  | 'isVideoVisible'
  | 'fretMarkerDisplay'
  | 'preferredLayout'
  | 'defaultSidecarWidthPx'
  | 'defaultTheaterHeightPx'
  | 'displayMode'
>;
