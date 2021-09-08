import $ from 'jquery';
import { throttle } from 'lodash';
import { Cursor } from 'opensheetmusicdisplay/build/dist/src';
import { CursorSnapshot, ScrollTarget } from '..';
import { Duration } from '../../../util/Duration';
import { NumberRange } from '../../../util/NumberRange';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { PointerPosition } from '../pointer';
import { RangedScrollIntent, ScrollDirection, ScrollIntent, ScrollSpeed } from '../types';

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

const SCROLL_DEFAULT_DURATION = Duration.ms(100);
const SCROLL_BACK_TOP_DURATION = Duration.ms(300);
const SCROLL_THROTTLE_DURATION = Duration.ms(SCROLL_DEFAULT_DURATION.ms + 10);
const SCROLL_GRACE_DURATION = Duration.ms(500);
const SCROLL_DELTA_TOLERANCE_PX = 2;
const SCROLL_JUMP_THRESHOLD_PX = 350;

export class Scroller {
  scrollContainer: HTMLElement;
  $scrollContainer: JQuery<HTMLElement>;
  imd: InternalMusicDisplay;

  lastScrollToId = Symbol();
  intentIndex = 0;
  intent: RangedScrollIntent = RANGED_SCROLL_INTENTS[0];
  scrollRafHandle = -1;
  isScrollingBasedOnIntent = false;

  constructor(scrollContainer: HTMLElement, imd: InternalMusicDisplay) {
    this.scrollContainer = scrollContainer;
    this.$scrollContainer = $(scrollContainer);
    this.imd = imd;
  }

  updateScrollIntent(position: PointerPosition) {
    const height = this.scrollContainer.offsetHeight;
    const positionFraction = position.relY / height;
    [this.intent, this.intentIndex] = this.findRangedScrollIntent(positionFraction);
  }

  startScrollingBasedOnIntent() {
    if (this.isScrollingBasedOnIntent) {
      return;
    }
    this.isScrollingBasedOnIntent = true;
    requestAnimationFrame(this.scrollBasedOnIntent);
  }

  stopScrollingBasedOnIntent() {
    this.isScrollingBasedOnIntent = false;
    cancelAnimationFrame(this.scrollRafHandle);
  }

  // TODO(jared) Make scrolling less abrasive by scrolling as little as possible.
  scrollToCursor(cursor: Cursor) {
    let scrollTop = $(cursor.cursorElement).position().top;
    const currentScrollTop = this.$scrollContainer.scrollTop() ?? 0;

    if (scrollTop > 0) {
      // Get all the sibling elements that are not notations and scroll past them
      this.$scrollContainer.children().each((_, child) => {
        const $child = $(child);
        if ($child.data('notation')) {
          return;
        }
        scrollTop += $child.outerHeight() ?? 0;
      });
    }

    const deltaScrollTop = Math.abs(currentScrollTop - scrollTop);
    if (deltaScrollTop < SCROLL_DELTA_TOLERANCE_PX) {
      return;
    }

    let duration = SCROLL_DEFAULT_DURATION;
    if (scrollTop === 0) {
      duration = SCROLL_BACK_TOP_DURATION;
    } else if (deltaScrollTop > SCROLL_JUMP_THRESHOLD_PX) {
      duration = Duration.ms(0);
    }

    this.scrollTo({ scrollTop, duration });
  }

  scrollToCursorSnapshot(cursorSnapshot: CursorSnapshot) {
    this.imd.withProbeCursor((probeCursor) => {
      cursorSnapshot.iteratorSnapshot.apply(probeCursor);
      this.scrollToCursor(probeCursor);
    });
  }

  scrollTo = throttle(
    (scrollTarget: ScrollTarget) => {
      if (this.isScrollingBasedOnIntent) {
        return;
      }

      const hasNoOverflow = this.scrollContainer.scrollHeight <= this.scrollContainer.clientHeight;
      if (hasNoOverflow) {
        return;
      }

      const lastScrollToId = Symbol();
      const didNewScrollInvoke = () => this.lastScrollToId !== lastScrollToId;
      this.$scrollContainer.animate(
        { scrollTop: scrollTarget.scrollTop },
        {
          queue: false,
          duration: scrollTarget.duration.ms,
          start: () => {
            this.lastScrollToId = lastScrollToId;
            this.imd.eventBus.dispatch('autoscrollstarted', {});
          },
          always: () => {
            if (didNewScrollInvoke()) {
              // Don't bother even enqueuing autoScrollEnd. Assume that another invocation will trigger it.
              return;
            }
            window.setTimeout(() => {
              if (didNewScrollInvoke()) {
                return;
              }
              this.imd.eventBus.dispatch('autoscrollended', {});
            }, SCROLL_GRACE_DURATION.ms);
          },
        }
      );
    },
    SCROLL_THROTTLE_DURATION.ms,
    { leading: true, trailing: true }
  );

  private scrollBasedOnIntent = () => {
    const scrollBy = this.getScrollBy(this.intent);
    this.scrollContainer.scrollBy({ top: scrollBy });
    this.scrollRafHandle = requestAnimationFrame(this.scrollBasedOnIntent);
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

  private findRangedScrollIntent(positionFraction: number): [RangedScrollIntent, number] {
    const cheapResult = this.cheapFindRangedScrollIntent(positionFraction);
    return cheapResult ? cheapResult : this.expensiveFindRangedScrollIntent(positionFraction);
  }

  private cheapFindRangedScrollIntent(positionFraction: number): [RangedScrollIntent, number] | null {
    const intent = this.intent;
    const index = this.intentIndex;

    if (intent.range.contains(positionFraction)) {
      return [intent, index];
    }

    const prevIndex = index - 1;
    const prevIntent = prevIndex >= 0 ? RANGED_SCROLL_INTENTS[prevIndex] : null;
    if (prevIntent && prevIntent.range.contains(positionFraction)) {
      return [prevIntent, prevIndex];
    }

    const nextIndex = index + 1;
    const nextIntent = nextIndex < RANGED_SCROLL_INTENTS.length ? RANGED_SCROLL_INTENTS[nextIndex] : null;
    if (nextIntent && nextIntent.range.contains(positionFraction)) {
      return [nextIntent, nextIndex];
    }

    return null;
  }

  private expensiveFindRangedScrollIntent(positionFraction: number): [RangedScrollIntent, number] {
    for (let index = 0; index < RANGED_SCROLL_INTENTS.length; index++) {
      const intent = RANGED_SCROLL_INTENTS[index];
      if (intent.range.contains(positionFraction)) {
        return [intent, index];
      }
    }
    throw new Error('something went wrong');
  }
}
