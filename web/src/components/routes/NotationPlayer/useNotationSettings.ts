import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { NotationPlayerSettings } from './types';

const NOTATION_SETTINGS_KEY = 'stringsyncNotationPlayerSettings';

const DEFAULT_SETTINGS: NotationPlayerSettings = Object.freeze({
  isFretboardVisible: false,
});

export const useNotationPlayerSettings = () => useLocalStorage(NOTATION_SETTINGS_KEY, DEFAULT_SETTINGS);
