import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NumberRange } from '../../util/NumberRange';
import { useRoutingLocalCache } from './useRoutingLocalCache';

// Redirect the user if they last visited between 1 minute and 14 days.
// This gives people a 1 minute grace period to try to visit the landing using a link
// again.
const REDIRECT_LANDING_TO_LIBRARY_TIME_MS_RANGE = NumberRange.from(60 * 1000).to(14 * 24 * 60 * 60 * 1000);

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
