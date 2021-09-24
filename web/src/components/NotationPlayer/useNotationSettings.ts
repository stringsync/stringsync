import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { NotationPlayerSettings } from './types';

const NOTATION_SETTINGS_KEY = 'stringsync_notation_settings';

const DEFAULT_SETTINGS: NotationPlayerSettings = Object.freeze({
  isFretboardVisible: false,
  isAutoscrollPreferred: true,
});

export const useNotationPlayerSettings = () => useLocalStorage(NOTATION_SETTINGS_KEY, DEFAULT_SETTINGS);
