import { useLocalStorage } from '../../hooks/useLocalStorage';

const ROUTING_CACHE_KEY = 'stringsync_routing_cache';

type RoutingCache = {
  lastVisitedLandingAtMsSinceEpoch: number;
};

const DEFAULT_ROUTING_CACHE: RoutingCache = Object.freeze({
  lastVisitedLandingAtMsSinceEpoch: 0,
});

export const useRoutingLocalCache = () => useLocalStorage(ROUTING_CACHE_KEY, DEFAULT_ROUTING_CACHE);
