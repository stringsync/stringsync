import { useLocalStorage } from '../../../hooks/useLocalStorage';

const LANDING_SETTINGS_KEY = 'stringsyncLandingSettings';

type LandingSettings = {
  lastVisitedAtMsSinceEpoch: number;
};

const DEFAULT_LANDING_SETTINGS: LandingSettings = Object.freeze({
  lastVisitedAtMsSinceEpoch: 0,
});

export const useLandingSettings = () => useLocalStorage(LANDING_SETTINGS_KEY, DEFAULT_LANDING_SETTINGS);
