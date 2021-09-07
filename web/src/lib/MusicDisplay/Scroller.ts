import { NumberRange } from '../../util/NumberRange';
import { PointerPosition } from './pointer';
import { RangedScrollIntent, ScrollDirection, ScrollIntent, ScrollSpeed } from './types';

const inf = Number.POSITIVE_INFINITY;

const RANGED_SCROLL_INTENTS: RangedScrollIntent[] = [
  { range: NumberRange.from(-inf).to(0), speed: ScrollSpeed.None, direction: ScrollDirection.None },
  { range: NumberRange.from(0).to(0.2), speed: ScrollSpeed.Run, direction: ScrollDirection.Up },
  { range: NumberRange.from(0.2).to(0.3), speed: ScrollSpeed.Walk, direction: ScrollDirection.Up },
  { range: NumberRange.from(0.3).to(0.4), speed: ScrollSpeed.Crawl, direction: ScrollDirection.Up },
  { range: NumberRange.from(0.4).to(0.6), speed: ScrollSpeed.None, direction: ScrollDirection.None },
  { range: NumberRange.from(0.6).to(0.7), speed: ScrollSpeed.Crawl, direction: ScrollDirection.Down },
  { range: NumberRange.from(0.7).to(0.8), speed: ScrollSpeed.Walk, direction: ScrollDirection.Down },
  { range: NumberRange.from(0.8).to(1), speed: ScrollSpeed.Run, direction: ScrollDirection.Down },
  { range: NumberRange.from(1).to(inf), speed: ScrollSpeed.None, direction: ScrollDirection.None },
];

const CRAWL_SCROLL_BY_PX = 1;
const WALK_SCROLL_BY_PX = 3;
const RUN_SCROLL_BY_PX = 10;

export class Scroller {
  scrollContainer: HTMLElement;
  rangedScrollIntent: RangedScrollIntent = RANGED_SCROLL_INTENTS[0];
  scrollRafHandle = -1;
  isScrolling = false;

  constructor(scrollContainer: HTMLElement) {
    this.scrollContainer = scrollContainer;
  }

  updateScrollIntent(position: PointerPosition) {
    const height = this.scrollContainer.offsetHeight;
    const positionFraction = position.relY / height;

    if (this.rangedScrollIntent.range.contains(positionFraction)) {
      return;
    }
    for (const rangedScrollIntent of RANGED_SCROLL_INTENTS) {
      if (rangedScrollIntent.range.contains(positionFraction)) {
        this.rangedScrollIntent = rangedScrollIntent;
        return;
      }
    }
    throw new Error('something went wrong');
  }

  start() {
    if (this.isScrolling) {
      return;
    }
    this.isScrolling = true;
    requestAnimationFrame(this.scroll);
  }

  stop() {
    this.isScrolling = false;
    cancelAnimationFrame(this.scrollRafHandle);
  }

  private scroll = () => {
    const scrollBy = this.getScrollBy(this.rangedScrollIntent);
    this.scrollContainer.scrollBy({ top: scrollBy });
    this.scrollRafHandle = requestAnimationFrame(this.scroll);
  };

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
