import { DisplayMode } from '../lib/musicxml';
import * as notations from '../lib/notations';
import { useLocalStorage } from './useLocalStorage';

export type NotationSettings = {
  preferredLayout: notations.NotationLayout;
  isFretboardVisible: boolean;
  fretMarkerDisplay: notations.FretMarkerDisplay;
  isAutoscrollPreferred: boolean;
  isVideoVisible: boolean;
  defaultTheaterHeightPx: number;
  defaultSidecarWidthPx: number;
  displayMode: DisplayMode;
};

const NOTATION_SETTINGS_KEY = 'stringsync_notation_settings';

const DEFAULT_NOTATION_SETTINGS: NotationSettings = {
  preferredLayout: 'sidecar',
  isVideoVisible: true,
  isFretboardVisible: true,
  isAutoscrollPreferred: true,
  fretMarkerDisplay: notations.FretMarkerDisplay.None,
  defaultSidecarWidthPx: 500,
  defaultTheaterHeightPx: 200,
  displayMode: DisplayMode.TabsOnly,
};

export const useNotationSettings = () => {
  return useLocalStorage<NotationSettings>(NOTATION_SETTINGS_KEY, DEFAULT_NOTATION_SETTINGS);
};
