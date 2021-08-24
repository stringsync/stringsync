import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { NotationPlayerSettings } from './types';

const NOTATION_SETTINGS_KEY = 'stringsyncNotationPlayerSettings';

const DEFAULT_SETTINGS: NotationPlayerSettings = Object.freeze({
  isFretboardVisible: false,
});

const isNotationSettings = (value: any): value is NotationPlayerSettings => {
  if (typeof value !== 'object') {
    return false;
  }

  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
    if (typeof value[k] !== typeof v) {
      return false;
    }
  }

  return true;
};

export const useNotationPlayerSettings = () => {
  return useLocalStorage(NOTATION_SETTINGS_KEY, DEFAULT_SETTINGS, isNotationSettings);
};
