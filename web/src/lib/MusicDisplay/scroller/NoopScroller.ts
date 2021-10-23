import { ScrollBehaviorType, Scroller } from './types';

export class NoopScroller implements Scroller {
  type = ScrollBehaviorType.Unknown;
  updateScrollIntent() {}
  scrollToCursor() {}
  disable() {}
  startAutoScrolling() {}
  startManualScrolling() {}
}
