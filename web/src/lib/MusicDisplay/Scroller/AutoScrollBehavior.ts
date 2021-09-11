import $ from 'jquery';
import { first, range } from 'lodash';
import { Cursor } from 'opensheetmusicdisplay';
import { ScrollRequestType } from '.';
import { Duration } from '../../../util/Duration';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { EntryAnalysis } from './EntryAnalysis';
import {
  Easing,
  HorizontalEdgeIntersection,
  IntersectionObserverAnalysis,
  ScrollBehavior,
  ScrollRequest,
  SizeComparison,
} from './types';

type AutoScrollTarget = {
  scrollTop: number;
  duration: Duration;
  easing: Easing;
};

const SCROLL_DEFAULT_DURATION = Duration.ms(150);
const SCROLL_BACK_TOP_DURATION = Duration.ms(500);
const SCROLL_BOTTOM_PADDING_PX = 20;
const SCROLL_GRACE_DURATION = Duration.ms(200);
const SCROLL_DELTA_TOLERANCE_PX = 2;
const SCROLL_JUMP_THRESHOLD_PX = 800;

export class AutoScrollBehavior implements ScrollBehavior {
  private scrollContainer: HTMLElement;
  private $scrollContainer: JQuery<HTMLElement>;
  private imd: InternalMusicDisplay;

  private observer: IntersectionObserver;
  private cursor: Cursor | null = null;
  private autoScrollHandle = -1;
  private deferHandle = -1;
  private lastEntries: IntersectionObserverEntry[] = [];
  private lastScrollId = Symbol();

  constructor(scrollContainer: HTMLElement, imd: InternalMusicDisplay) {
    this.scrollContainer = scrollContainer;
    this.$scrollContainer = $(scrollContainer);
    this.imd = imd;
    this.observer = new IntersectionObserver(this.onObservation, {
      root: scrollContainer,
      threshold: range(0, 1, 0.1),
    });
  }

  start() {}

  stop() {
    window.cancelIdleCallback(this.deferHandle);
    window.clearTimeout(this.autoScrollHandle);
    this.observer.disconnect();
    this.cursor = null;
  }

  handle(request: ScrollRequest) {
    if (request.type !== ScrollRequestType.Cursor) {
      return;
    }
    if (this.cursor !== request.cursor) {
      if (this.cursor) {
        this.observer.unobserve(this.cursor.cursorElement);
      }
      this.lastEntries = [];
      this.cursor = request.cursor;
      this.observer.observe(request.cursor.cursorElement);
    }
    this.defer(this.scrollToCursor);
  }

  private onObservation: IntersectionObserverCallback = (entries) => {
    this.lastEntries = entries;
    this.defer(this.scrollToCursor);
  };

  private defer(callback: () => void) {
    window.cancelIdleCallback(this.deferHandle);
    this.deferHandle = window.requestIdleCallback(callback);
  }

  private scrollToCursor = () => {
    // Sometimes there are more than one entry, so instead of trying to figure
    // out which one to pick, we default to a null entry analysis.
    const entry = this.lastEntries.length === 1 ? first(this.lastEntries)! : null;
    const analysis = EntryAnalysis.compute(entry);

    const currentScrollTop = this.$scrollContainer.scrollTop() ?? 0;
    const targetScrollTop = this.calculateBestScrollTop(analysis, currentScrollTop);

    const deltaScrollTop = Math.abs(currentScrollTop - targetScrollTop);
    if (deltaScrollTop < SCROLL_DELTA_TOLERANCE_PX) {
      return;
    }

    let duration = SCROLL_DEFAULT_DURATION;
    let easing: Easing = 'linear';
    if (targetScrollTop === 0) {
      duration = SCROLL_BACK_TOP_DURATION;
      easing = 'swing';
    } else if (deltaScrollTop > SCROLL_JUMP_THRESHOLD_PX) {
      duration = Duration.ms(0);
    }

    this.scrollTo({
      scrollTop: targetScrollTop,
      duration,
      easing,
    });
  };

  private calculateBestScrollTop(analysis: IntersectionObserverAnalysis, currentScrollTop: number): number {
    if (!this.cursor || this.cursor.Hidden) {
      return 0;
    }

    let nonNotationHeightPx = 0;
    this.$scrollContainer.children().each((_, child) => {
      const $child = $(child);
      const outerHeight = $child.outerHeight() ?? 0;
      nonNotationHeightPx += $child.data('notation') ? 0 : outerHeight;
    });

    const cursorTop = nonNotationHeightPx + $(this.cursor.cursorElement).position().top;

    if (analysis.sizeComparison === SizeComparison.Bigger) {
      return cursorTop;
    }
    if (analysis.visibility === 1) {
      return currentScrollTop;
    }
    if (analysis.horizontalEdgeIntersection === HorizontalEdgeIntersection.Top) {
      return cursorTop;
    }
    if (analysis.horizontalEdgeIntersection === HorizontalEdgeIntersection.Bottom) {
      return currentScrollTop + analysis.invisibleHeightPx + SCROLL_BOTTOM_PADDING_PX;
    }
    return cursorTop;
  }

  scrollTo = (scrollTarget: AutoScrollTarget) => {
    const hasNoOverflow = this.scrollContainer.scrollHeight <= this.scrollContainer.clientHeight;
    if (hasNoOverflow) {
      return;
    }
    const lastScrollId = Symbol();
    const didNewScrollInvoke = () => this.lastScrollId !== lastScrollId;
    this.$scrollContainer.animate(
      { scrollTop: scrollTarget.scrollTop },
      {
        easing: scrollTarget.easing,
        queue: false,
        duration: scrollTarget.duration.ms,
        start: () => {
          this.lastScrollId = lastScrollId;
          this.imd.eventBus.dispatch('autoscrollstarted', {});
        },
        always: () => {
          if (didNewScrollInvoke()) {
            // Don't bother even enqueuing autoScrollEnd. Assume that another invocation will trigger it.
            return;
          }
          this.autoScrollHandle = window.setTimeout(() => {
            if (didNewScrollInvoke()) {
              return;
            }
            this.imd.eventBus.dispatch('autoscrollended', {});
          }, SCROLL_GRACE_DURATION.ms);
        },
      }
    );
  };
}
