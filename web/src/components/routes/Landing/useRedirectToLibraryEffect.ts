import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useEffectOnce } from '../../../hooks';
import { RootState } from '../../../store';
import { NumberRange } from '../../../util/NumberRange';
import { useLandingSettings } from './useLandingSettings';

export const useRedirectToLibraryEffect = (redirectTimeMsRange: NumberRange) => {
  const isInitialPage = useSelector<RootState, boolean>((state) => state.history.prevRoute === '');
  const [settings, updateSettings] = useLandingSettings();
  const history = useHistory();

  useEffectOnce(() => {
    const now = new Date().getTime();
    updateSettings({ ...settings, lastVisitedAtMsSinceEpoch: now });

    if (!isInitialPage) {
      // The user intentionally tried to visit this page using some link in the app, so do not redirect.
      return;
    }

    const timeSinceLastVisitMs = now - settings.lastVisitedAtMsSinceEpoch;
    const shouldRedirectToLibrary = redirectTimeMsRange.contains(timeSinceLastVisitMs);
    if (shouldRedirectToLibrary) {
      history.push('/library');
    }
  });
};
