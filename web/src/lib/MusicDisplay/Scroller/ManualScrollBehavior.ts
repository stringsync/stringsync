import { IntentScrollRequest } from '.';
import { NumberRange } from '../../../util/NumberRange';
import { ScrollBehavior, ScrollDirection, ScrollIntent, ScrollSpeed } from './types';

type RangedScrollIntent = ScrollIntent & {
  range: NumberRange;
};

const inf = Number.POSITIVE_INFINITY;

// These are purposely not symmetrical around 0.5 because the automatic scroll aims to keep the
// notation at the top. Therefore, the neutral position (corresponding to speed: None, direction: None)
// is actually <0.5.
const RANGED_SCROLL_INTENTS: RangedScrollIntent[] = [
  { range: NumberRange.from(-inf).to(0), speed: ScrollSpeed.None, direction: ScrollDirection.None },
  { range: NumberRange.from(0).to(0.05), speed: ScrollSpeed.Run, direction: ScrollDirection.Up },
  { range: NumberRange.from(0.05).to(0.1), speed: ScrollSpeed.Walk, direction: ScrollDirection.Up },
  { range: NumberRange.from(0.1).to(0.15), speed: ScrollSpeed.Crawl, direction: ScrollDirection.Up },
  { range: NumberRange.from(0.15).to(0.6), speed: ScrollSpeed.None, direction: ScrollDirection.None },
  { range: NumberRange.from(0.6).to(0.7), speed: ScrollSpeed.Crawl, direction: ScrollDirection.Down },
  { range: NumberRange.from(0.7).to(0.8), speed: ScrollSpeed.Walk, direction: ScrollDirection.Down },
  { range: NumberRange.from(0.8).to(1), speed: ScrollSpeed.Run, direction: ScrollDirection.Down },
  { range: NumberRange.from(1).to(inf), speed: ScrollSpeed.None, direction: ScrollDirection.None },
];

const CRAWL_SCROLL_BY_PX = 1;
const WALK_SCROLL_BY_PX = 3;
const RUN_SCROLL_BY_PX = 10;

export class ManualScrollBehavior implements ScrollBehavior {
  lastScrollToId = Symbol();
  currentIntentIndex = 0;
  scrollRafHandle = -1;
  scrollContainer: HTMLElement;

  constructor(scrollContainer: HTMLElement) {
    this.scrollContainer = scrollContainer;
  }

  start() {
    this.currentIntentIndex = 0;
    this.scroll();
  }

  stop() {
    cancelAnimationFrame(this.scrollRafHandle);
  }

  call(request: IntentScrollRequest) {
    const height = this.scrollContainer.offsetHeight;
    const relYFrac = request.relY / height;
    this.currentIntentIndex = this.findRangedScrollIntentIndex(relYFrac);
  }

  private getCurrentScrollIntent() {
    return RANGED_SCROLL_INTENTS[this.currentIntentIndex];
  }

  private scroll = () => {
    const scrollIntent = this.getCurrentScrollIntent();
    const scrollBy = this.getScrollBy(scrollIntent);
    this.scrollContainer.scrollBy({ top: scrollBy });
    this.scrollRafHandle = requestAnimationFrame(this.scroll);
  };

  private findRangedScrollIntentIndex(relYFrac: number): number {
    const cheapResult = this.cheapFindRangedScrollIntentIndex(relYFrac);
    return cheapResult ? cheapResult : this.expensiveFindRangedScrollIntentIndex(relYFrac);
  }

  private cheapFindRangedScrollIntentIndex(relYFrac: number): number | null {
    const currentIntent = RANGED_SCROLL_INTENTS[this.currentIntentIndex];
    if (currentIntent.range.contains(relYFrac)) {
      return this.currentIntentIndex;
    }

    const prevIntent = RANGED_SCROLL_INTENTS[this.currentIntentIndex - 1];
    if (prevIntent && prevIntent.range.contains(relYFrac)) {
      return this.currentIntentIndex - 1;
    }

    const nextIntent = RANGED_SCROLL_INTENTS[this.currentIntentIndex + 1];
    if (nextIntent && nextIntent.range.contains(relYFrac)) {
      return this.currentIntentIndex + 1;
    }

    return null;
  }

  private expensiveFindRangedScrollIntentIndex(relYFrac: number): number {
    const index = RANGED_SCROLL_INTENTS.findIndex((intent) => intent.range.contains(relYFrac));
    return Math.max(0, index);
  }

  private getScrollBy(scrollIntent: ScrollIntent) {
    let scrollBy = 0;

    switch (scrollIntent.speed) {
      case ScrollSpeed.Walk:
        scrollBy = WALK_SCROLL_BY_PX;
        break;
      case ScrollSpeed.Run:
        scrollBy = RUN_SCROLL_BY_PX;
        break;
      case ScrollSpeed.Crawl:
        scrollBy = CRAWL_SCROLL_BY_PX;
        break;
      default:
        scrollBy = 0;
    }

    switch (scrollIntent.direction) {
      case ScrollDirection.Up:
        scrollBy *= -1;
        break;
      case ScrollDirection.Down:
        scrollBy *= 1;
        break;
      default:
        scrollBy = 0;
    }

    return scrollBy;
  }
}
