import { createAction, createReducer } from '@reduxjs/toolkit';
import { useMemo, useReducer } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export type NotationPlayerSettingsApi = {
  setFretboardVisibility: (isFretboardVisible: boolean) => void;
  setAutoscrollPreference: (isAutoscrollPreferred: boolean) => void;
  setScaleSelectionType: (scaleSelectionType: ScaleSelectionType) => void;
  setSelectedScale: (selectedScale: string | null) => void;
};

export enum ScaleSelectionType {
  None,
  Main,
  User,
  Random,
}

type PersistedSettings = {
  isFretboardVisible: boolean;
  isAutoscrollPreferred: boolean;
};

type EphemeralSettings = {
  scaleSelectionType: ScaleSelectionType;
  selectedScale: string | null;
};

export type NotationPlayerSettings = PersistedSettings & EphemeralSettings;

const PERSISTED_SETTINGS_KEY = 'stringsync_notation_settings';

const DEFAULT_PERSISTED_SETTINGS: PersistedSettings = {
  isFretboardVisible: false,
  isAutoscrollPreferred: true,
};

const DEFAULT_EPHEMERAL_SETTINGS: EphemeralSettings = {
  scaleSelectionType: ScaleSelectionType.None,
  selectedScale: null,
};

const EPHEMERAL_SETTINGS_ACTIONS = {
  setSelectedScale: createAction<{ selectedScale: string | null }>('setSelectedScale'),
  setScaleSelectionType: createAction<{ scaleSelectionType: ScaleSelectionType }>('setScaleSelectionType'),
};

const ephemeralSettingsReducer = createReducer(DEFAULT_EPHEMERAL_SETTINGS, (builder) => {
  builder.addCase(EPHEMERAL_SETTINGS_ACTIONS.setScaleSelectionType, (state, action) => {
    state.scaleSelectionType = action.payload.scaleSelectionType;
  });
  builder.addCase(EPHEMERAL_SETTINGS_ACTIONS.setSelectedScale, (state, action) => {
    state.selectedScale = action.payload.selectedScale;
  });
});

export const useNotationPlayerSettings = (): [NotationPlayerSettings, NotationPlayerSettingsApi] => {
  const [persistedSettings, setPersistedSettings] = useLocalStorage(PERSISTED_SETTINGS_KEY, DEFAULT_PERSISTED_SETTINGS);
  const [ephemeralSettings, dispatch] = useReducer(ephemeralSettingsReducer, DEFAULT_EPHEMERAL_SETTINGS);

  const notationPlayerSettings = useMemo<NotationPlayerSettings>(
    () => ({
      ...persistedSettings,
      ...ephemeralSettings,
    }),
    [persistedSettings, ephemeralSettings]
  );

  const notationPlayerSettingsApi = useMemo<NotationPlayerSettingsApi>(
    () => ({
      setFretboardVisibility: (isFretboardVisible: boolean) => {
        setPersistedSettings({ ...persistedSettings, isFretboardVisible });
      },
      setAutoscrollPreference: (isAutoscrollPreferred: boolean) => {
        setPersistedSettings({ ...persistedSettings, isAutoscrollPreferred });
      },
      setScaleSelectionType: (scaleSelectionType: ScaleSelectionType) => {
        dispatch(EPHEMERAL_SETTINGS_ACTIONS.setScaleSelectionType({ scaleSelectionType }));
      },
      setSelectedScale: (selectedScale: string | null) => {
        dispatch(EPHEMERAL_SETTINGS_ACTIONS.setSelectedScale({ selectedScale }));
      },
    }),
    [persistedSettings, setPersistedSettings]
  );

  return [notationPlayerSettings, notationPlayerSettingsApi];
};
