import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Duration } from '../../util/Duration';
import { NumberRange } from '../../util/NumberRange';
import { useRoutingLocalCache } from './useRoutingLocalCache';

// Redirect the user if they last visited between 1 minute and 14 days.
// This gives people a 1 minute grace period to try to visit the landing using a link
// again.
const ONE_MINUTE = Duration.min(1);
const TWO_WEEKS = Duration.day(14);
const REDIRECT_LANDING_TO_LIBRARY_TIME_MS_RANGE = NumberRange.from(ONE_MINUTE.ms).to(TWO_WEEKS.ms);

const getMsSinceEpoch = () => new Date().getTime();

export const useRoutingBehavior = () => {
  const isInitialPage = useSelector<RootState, boolean>((state) => state.history.prevRoute === '');
  const [cache, updateCache] = useRoutingLocalCache();
  const [shouldRedirectFromLandingToLibrary, setShouldRedirectFromLandingToLibrary] = useState(() => {
    const msSinceLandingLastVisited = getMsSinceEpoch() - cache.lastVisitedLandingAtMsSinceEpoch;
    return isInitialPage && REDIRECT_LANDING_TO_LIBRARY_TIME_MS_RANGE.contains(msSinceLandingLastVisited);
  });

  const recordLandingVisit = useCallback(() => {
    updateCache({
      ...cache,
      lastVisitedLandingAtMsSinceEpoch: getMsSinceEpoch(),
    });
  }, [cache, updateCache]);

  useEffect(() => {
    setShouldRedirectFromLandingToLibrary(false);
  }, [isInitialPage]);

  return { shouldRedirectFromLandingToLibrary, recordLandingVisit };
};
