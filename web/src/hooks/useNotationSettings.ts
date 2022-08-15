import { useCallback, useMemo, useState } from 'react';
import { QualityLevel, QualitySelectionStrategy } from '../lib/MediaPlayer';
import { DisplayMode } from '../lib/musicxml';
import * as notations from '../lib/notations';
import { useLocalStorage } from './useLocalStorage';

export type Quality =
  | {
      type: 'specified';
      level: QualityLevel;
    }
  | {
      type: 'strategy';
      strategy: QualitySelectionStrategy;
    };

export type NotationSettings = {
  preferredLayout: notations.NotationLayout;
  isFretboardVisible: boolean;
  fretMarkerDisplay: notations.FretMarkerDisplay;
  isAutoscrollPreferred: boolean;
  isVideoVisible: boolean;
  defaultTheaterHeightPx: number;
  defaultSidecarWidthPx: number;
  displayMode: DisplayMode;
  isLoopActive: boolean;
  scaleSelectionType: notations.ScaleSelectionType;
  selectedScale: string | null;
  quality: Quality;
};

export type SetNotationSettings = (notationSettings: NotationSettings) => void;

type PersistedNotationSettings = Pick<
  NotationSettings,
  | 'preferredLayout'
  | 'isFretboardVisible'
  | 'fretMarkerDisplay'
  | 'isAutoscrollPreferred'
  | 'isVideoVisible'
  | 'defaultTheaterHeightPx'
  | 'defaultSidecarWidthPx'
  | 'displayMode'
>;

type EphemeralNotationSettings = Omit<NotationSettings, keyof PersistedNotationSettings>;

const NOTATION_SETTINGS_KEY = 'stringsync_notation_settings';

const DEFAULT_PERSISTED_NOTATION_SETTINGS: PersistedNotationSettings = {
  preferredLayout: 'sidecar',
  isVideoVisible: true,
  isFretboardVisible: true,
  isAutoscrollPreferred: true,
  fretMarkerDisplay: notations.FretMarkerDisplay.None,
  defaultSidecarWidthPx: 500,
  defaultTheaterHeightPx: 200,
  displayMode: DisplayMode.TabsOnly,
};

const DEFAULT_EPHEMERAL_SETTINGS: EphemeralNotationSettings = {
  isLoopActive: false,
  scaleSelectionType: notations.ScaleSelectionType.None,
  selectedScale: null,
  quality: { type: 'strategy', strategy: QualitySelectionStrategy.Auto },
};

export const useNotationSettings = (): [
  notationSettings: NotationSettings,
  setNotationSettings: SetNotationSettings
] => {
  const [persistedSettings, setPersistedSettings] = useLocalStorage<PersistedNotationSettings>(
    NOTATION_SETTINGS_KEY,
    DEFAULT_PERSISTED_NOTATION_SETTINGS
  );

  const [ephemeralSettings, setEphemeralSettings] = useState(DEFAULT_EPHEMERAL_SETTINGS);

  const notationSettings = useMemo(
    () => ({
      ...persistedSettings,
      ...ephemeralSettings,
    }),
    [persistedSettings, ephemeralSettings]
  );

  const setNotationSettings = useCallback(
    (nextNotationSettings: NotationSettings) => {
      const nextPersistedSettings: Record<string, any> = {};
      const nextEphemeralSettings: Record<string, any> = {};

      for (const [key, val] of Object.entries(nextNotationSettings)) {
        if (key in DEFAULT_PERSISTED_NOTATION_SETTINGS) {
          nextPersistedSettings[key] = val;
        }
        if (key in DEFAULT_EPHEMERAL_SETTINGS) {
          nextEphemeralSettings[key] = val;
        }
      }

      if (Object.keys(nextPersistedSettings).length > 0) {
        setPersistedSettings({ ...persistedSettings, ...nextPersistedSettings });
      }
      if (Object.keys(nextEphemeralSettings).length > 0) {
        setEphemeralSettings({ ...ephemeralSettings, ...nextEphemeralSettings });
      }
    },
    [persistedSettings, setPersistedSettings, ephemeralSettings]
  );

  return [notationSettings, setNotationSettings];
};
